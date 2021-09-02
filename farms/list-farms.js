import { PublicKey } from '@solana/web3.js'
import { OpenOrders } from '@project-serum/serum'
import Big from 'bignumber.js'

import { FusionPool, normalizeForFusionPool } from './fusion'
import { Farm, normalizeForFarm } from './farm'

import { getFarmFromPoolId } from '../util/farms'
import { getPoolByNameAndLpMintAddress } from '../util/pools'

import {
  AMM_INFO_LAYOUT,
  AMM_INFO_LAYOUT_V3,
  AMM_INFO_LAYOUT_V4,
  MINT_LAYOUT,
  USER_STAKE_INFO_ACCOUNT_LAYOUT,
  USER_STAKE_INFO_ACCOUNT_LAYOUT_V4,
  STAKE_INFO_LAYOUT,
  STAKE_INFO_LAYOUT_V4,
  ACCOUNT_LAYOUT
} from '../const/layouts'

import {
  STAKE_PROGRAM_ID,
  STAKE_PROGRAM_ID_V4,
  STAKE_PROGRAM_ID_V5
} from '../const/ids'

import {
  getMultipleAccounts,
  getProgramAccounts,
  getKeyByValue,
  COMMITMENT
} from '../util/solana-rpc'

import debug from '../util/log'
const log = debug.extend('util:farming:list-pools')

function parseAmmLayout(data, version) {
  if (version === 2) {
    return AMM_INFO_LAYOUT.decode(data)
  } else if (version === 3) {
    return AMM_INFO_LAYOUT_V3.decode(data)
  }
  return AMM_INFO_LAYOUT_V4.decode(data)
}

const fetchProgramAccounts = async (connection, publicKey) => {
  log('fetchProgramAccounts')

  //
  // Get all program accounts for the stake program which are associated with the public key.
  // This returns all accounts associated with the V4 program, so we need to lookup which poolId the account
  // is part of (belongs to?).
  //
  const programs = [
    {
      stakeProgramId: STAKE_PROGRAM_ID,
      userStakeInfoLayout: USER_STAKE_INFO_ACCOUNT_LAYOUT,
      stakeInfoLayout: STAKE_INFO_LAYOUT
    },
    {
      stakeProgramId: STAKE_PROGRAM_ID_V4,
      userStakeInfoLayout: USER_STAKE_INFO_ACCOUNT_LAYOUT_V4,
      stakeInfoLayout: STAKE_INFO_LAYOUT_V4
    },
    {
      stakeProgramId: STAKE_PROGRAM_ID_V5,
      userStakeInfoLayout: USER_STAKE_INFO_ACCOUNT_LAYOUT_V4,
      stakeInfoLayout: STAKE_INFO_LAYOUT_V4
    }
  ]

  const programAccountsPromises = programs.map(async (program) => {
    return getProgramAccounts(
      connection,
      publicKey,
      program.stakeProgramId,
      program.userStakeInfoLayout,
      COMMITMENT
    )
  })

  const programAccounts = (await Promise.all(programAccountsPromises)).reduce(
    (prev, accounts, idx) => {
      accounts = accounts.map((account) => {
        account.program = programs[idx]
        return account
      })

      return prev.concat(accounts)
    },
    []
  )

  return programAccounts
}

export async function listFarms(connection, publicKey) {
  log('listFarms')

  const programAccounts = await fetchProgramAccounts(connection, publicKey)

  const results = programAccounts.map(async ({ account, program }) => {
    const programAccount = program.userStakeInfoLayout.decode(account.data)
    if (!programAccount.depositBalance.toNumber()) return

    //
    // For this example we'll skip all the non COPE-USDC accounts.
    //
    const poolId = programAccount.poolId.toBase58()
    const farmData = await getFarmFromPoolId(poolId)

    if (!farmData) return

    const poolData = await getPoolByNameAndLpMintAddress(
      farmData.name,
      farmData.lp.mintAddress
    )
    if (!poolData) return

    let poolAccountInfo = await connection.getAccountInfo(
      new PublicKey(poolId),
      {
        commitment: COMMITMENT
      }
    )

    poolAccountInfo = program.stakeInfoLayout.decode(poolAccountInfo.data)

    let pool
    if (farmData.fusion) {
      pool = new FusionPool(
        normalizeForFusionPool(farmData, poolAccountInfo, programAccount)
      )
    } else {
      pool = new Farm(
        normalizeForFarm(farmData, poolAccountInfo, programAccount)
      )
    }

    const poolLpTokenAccount = await connection.getAccountInfo(
      new PublicKey(farmData.poolLpTokenAccount),
      {
        commitment: COMMITMENT
      }
    )

    const { amount } = ACCOUNT_LAYOUT.decode(poolLpTokenAccount.data)
    pool.setPoolLpTokenAmount(amount.toNumber())

    const accounts = await getMultipleAccounts({
      connection,
      publicKeys: [
        new PublicKey(poolData.lp.mintAddress),
        new PublicKey(poolData.poolCoinTokenAccount),
        new PublicKey(poolData.poolPcTokenAccount),
        new PublicKey(poolData.ammOpenOrders),
        new PublicKey(poolData.ammId)
      ]
    })

    accounts.forEach(({ account, publicKey }) => {
      const accountType = getKeyByValue(poolData, publicKey.toBase58())

      switch (accountType) {
        case 'mintAddress':
          {
            const { supply } = MINT_LAYOUT.decode(account.data)
            pool.setMintAccountSupply(supply.toNumber())
          }
          break
        case 'poolCoinTokenAccount':
          {
            const { amount } = ACCOUNT_LAYOUT.decode(account.data)
            pool.addToCoinBalance(new Big(amount.toString()))
          }
          break
        case 'poolPcTokenAccount':
          {
            const { amount } = ACCOUNT_LAYOUT.decode(account.data)
            pool.addToPcBalance(new Big(amount.toNumber()))
          }
          break
        case 'ammOpenOrders':
          {
            const OPEN_ORDERS_LAYOUT = OpenOrders.getLayout(
              new PublicKey(poolData.serumProgramId)
            )

            const { baseTokenTotal, quoteTokenTotal } =
              OPEN_ORDERS_LAYOUT.decode(account.data)

            pool.addToPcBalance(new Big(quoteTokenTotal.toNumber()))
            pool.addToCoinBalance(new Big(baseTokenTotal.toNumber()))
          }
          break
        case 'ammId':
          {
            const { needTakePnlCoin, needTakePnlPc } = parseAmmLayout(
              account.data,
              poolData.version
            )

            pool.subtractFromCoinBalance(new Big(needTakePnlCoin.toNumber()))
            pool.subtractFromPcBalance(new Big(needTakePnlPc.toNumber()))
          }
          break
      }
    })

    return pool
  })

  return await Promise.all(results)
}
