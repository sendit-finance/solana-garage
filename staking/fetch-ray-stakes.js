import { PublicKey } from '@solana/web3.js'

import { getFarmFromPoolId } from '../util/farms'
import { getProgramAccounts, COMMITMENT } from '../util/solana-rpc'
import { RayStake, normalizeForRayStake } from './stake/ray'
import TokenAmount from '../util/token-amount'

import {
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

import debug from '../util/log'
const log = debug.extend('util:staking:list-ray-stakes')

export async function fetchRayStakes({ connection, publicKey, emitter }) {
  log('fetch')

  publicKey = publicKey.toBase58()

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

  const programAccountsPromises = programs.map((program) =>
    getProgramAccounts(
      connection,
      publicKey,
      program.stakeProgramId,
      program.userStakeInfoLayout,
      COMMITMENT
    )
  )

  const programAccounts = (await Promise.all(programAccountsPromises)).reduce(
    (prev, results, idx) => {
      results = results.map((result) => {
        result.program = programs[idx]
        result.account.publicKey = result.pubkey
        return result
      })

      return prev.concat(results)
    },
    []
  )

  const results = programAccounts.map(async ({ account, program }) => {
    if (emitter.isStopped) return

    const userStakeInfo = program.userStakeInfoLayout.decode(account.data)

    if (!userStakeInfo.depositBalance.toNumber()) return

    const poolId = userStakeInfo.poolId.toBase58()
    const farmData = await getFarmFromPoolId(poolId)

    if (!farmData) {
      log('error', `Farm ${poolId} not supported`)
      return
    }

    if (!farmData.isStake) return

    let poolAccountInfo = await connection.getAccountInfo(
      new PublicKey(poolId),
      {
        commitment: COMMITMENT
      }
    )

    poolAccountInfo = program.stakeInfoLayout.decode(poolAccountInfo.data)

    const stake = new RayStake(
      normalizeForRayStake(farmData, poolAccountInfo, userStakeInfo, account)
    )

    if (emitter.isStopped) return

    const poolLpTokenAccount = await connection.getAccountInfo(
      new PublicKey(farmData.poolLpTokenAccount),
      {
        commitment: COMMITMENT
      }
    )

    const { amount } = ACCOUNT_LAYOUT.decode(poolLpTokenAccount.data)

    stake.setPoolLpTokenAmount(
      new TokenAmount(amount.toNumber(), farmData.lp.decimals)
    )

    emitter.emit('stake', stake)
  })

  return Promise.all(results)
}
