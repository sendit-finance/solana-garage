import { getTokenByMintAddress } from '../util/tokens'
import { fetchSolBalance } from './fetch-sol-balance'
import { TokenAmount } from '../util'

import debug from '../util/log'
const log = debug.extend('tokens:list-token-accounts')

import { TOKEN_PROGRAM_ID } from '../const/ids'

function getUnknownToken(address, decimals) {
  return {
    isUnknown: true,
    symbol: address,
    name: address,
    address,
    decimals
  }
}

export async function listTokenAccounts(connection, publicKey) {
  log('listTokenAccounts')

  const info = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID
  })

  const solTokenInfo = await fetchSolBalance(connection, publicKey)

  const tokens = {}

  // Dedupe and filter out tokens with amount == 0.
  const promises = info.value
    .filter((item) => {
      return item.account.data.parsed.info.tokenAmount.amount > 0
    })
    .map(async (item) => {
      const info = item.account.data.parsed.info

      const { mint: address = '', tokenAmount = {} } = info
      const { amount = 0 } = tokenAmount

      //
      // Find the token by address
      //
      let tokenInfo = await getTokenByMintAddress(address)
      if (!tokenInfo) {
        tokenInfo = getUnknownToken(address, info.tokenAmount.decimals)
      }

      const { symbol = '' } = tokenInfo
      if (tokenInfo && amount) {
        //
        // If this is the first time we encounter this token...
        //
        if (!tokens[symbol]) {
          tokens[symbol] = tokenInfo
          tokens[symbol].amount = new TokenAmount(amount, tokenInfo.decimals)
        } else {
          //
          // Otherwise, add to existing balance of the token
          //
          tokens[symbol].amount = tokens[symbol].amount.plus(
            new TokenAmount(amount, tokenInfo.decimals)
          )
        }
      } else log(`No balance for ${symbol}`)
    })

  await Promise.all(promises)

  tokens.SOL = solTokenInfo

  return Object.keys(tokens).map((key) => {
    return tokens[key]
  })
}
