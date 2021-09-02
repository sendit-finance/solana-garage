import { PublicKey } from '@solana/web3.js'
import { OpenOrders } from '@project-serum/serum'

import { getMultipleAccounts, getKeyByValue, TokenAmount } from '../util'
import { getPoolByNameAndLpMintAddress } from '../util/pools'
import {
  ACCOUNT_LAYOUT,
  AMM_INFO_LAYOUT,
  AMM_INFO_LAYOUT_V3,
  AMM_INFO_LAYOUT_V4,
  MINT_LAYOUT
} from '../const/layouts'

import { LiquidityToken, normalizeForLiquidityToken } from './liquidity-token'

export async function listLiquidityForTokens(connection, liquidityPoolTokens) {
  const poolPromises = liquidityPoolTokens.map(async (liquidityPoolToken) => {
    const pool = await getPoolByNameAndLpMintAddress(
      liquidityPoolToken.symbol,
      liquidityPoolToken.address
    )

    const liquidityToken = new LiquidityToken(normalizeForLiquidityToken(pool))
    liquidityToken.setLpTokenAmoun(liquidityPoolToken.amount)

    const {
      poolCoinTokenAccount,
      poolPcTokenAccount,
      ammOpenOrders,
      ammId,
      lp
    } = pool

    const publicKeys = [
      new PublicKey(poolCoinTokenAccount),
      new PublicKey(poolPcTokenAccount),
      new PublicKey(ammOpenOrders),
      new PublicKey(ammId),
      new PublicKey(lp.mintAddress)
    ]

    const accounts = await getMultipleAccounts({ connection, publicKeys })

    accounts.forEach(({ account, publicKey }) => {
      const accountType = getKeyByValue(pool, publicKey.toBase58())

      switch (accountType) {
        case 'poolCoinTokenAccount': {
          const { amount } = ACCOUNT_LAYOUT.decode(account.data)
          // Quick fix: use toString() as number can only safely store up to 53 bits.
          liquidityToken.addToCoinBalance(
            new TokenAmount(amount.toString(), pool.coin.decimals)
          )
          break
        }
        case 'poolPcTokenAccount': {
          const { amount } = ACCOUNT_LAYOUT.decode(account.data)
          liquidityToken.addToPcBalance(
            new TokenAmount(amount.toNumber(), pool.pc.decimals)
          )
          break
        }
        case 'ammOpenOrders': {
          const OPEN_ORDERS_LAYOUT = OpenOrders.getLayout(
            new PublicKey(pool.serumProgramId)
          )
          const parsed = OPEN_ORDERS_LAYOUT.decode(account.data)

          const { baseTokenTotal, quoteTokenTotal } = parsed

          liquidityToken.addToCoinBalance(
            new TokenAmount(baseTokenTotal.toString(), pool.coin.decimals)
          )
          liquidityToken.addToPcBalance(
            new TokenAmount(quoteTokenTotal.toString(), pool.pc.decimals)
          )
          break
        }
        case 'ammId': {
          let parsed
          if (pool.version === 2) {
            parsed = AMM_INFO_LAYOUT.decode(account.data)
          } else if (pool.version === 3) {
            parsed = AMM_INFO_LAYOUT_V3.decode(account.data)
          } else {
            parsed = AMM_INFO_LAYOUT_V4.decode(account.data)

            const { swapFeeNumerator, swapFeeDenominator } = parsed

            liquidityToken.setFees({
              swapFeeNumerator: swapFeeNumerator.toNumber(),
              swapFeeDenominator: swapFeeDenominator.toNumber()
            })
          }

          const { status, needTakePnlCoin, needTakePnlPc } = parsed

          liquidityToken.setStatus(status)

          liquidityToken.subtractFromCoinBalance(
            new TokenAmount(needTakePnlCoin.toNumber(), pool.coin.decimals)
          )
          liquidityToken.subtractFromPcBalance(
            new TokenAmount(needTakePnlPc.toNumber(), pool.pc.decimals)
          )

          break
        }
        // getLpSupply
        case 'mintAddress': {
          const { supply } = MINT_LAYOUT.decode(account.data)

          liquidityToken.setTotalSupply(
            new TokenAmount(supply.toString(), pool.lp.decimals)
          )

          break
        }
      }
    })

    return liquidityToken
  })

  return await Promise.all(poolPromises)
}
