import {
  PublicKey,
  Transaction,
  SystemProgram,
  StakeProgram,
  Authorized
} from '@solana/web3.js'

import { createPublicKeysBatchWithSeed } from '../util/keys'
import { getMultipleAccounts } from '../util/solana-rpc'

import debug from '../util/log'
const log = debug.extend('staking:create-sol-stake')

// The validator to which we are staking for now
const FIGMENT = 'CcaHc2L43ZWjwCHART3oZoJvHLAe9hzT2DJNUpBzoTN1'

export const getNextStakeAccountPublicKeyAndSeed = async (connection, publicKey, seedPrefix = '') => {
  if (!connection) throw new TypeError('connection argument is missing')
  if (!publicKey) throw new TypeError('publicKey argument is missing')

  const batchSize = 3

  for (let batch = 0; batch < 100; batch += batchSize) {
    log('getNextStakeAccountPublicKeyAndSeed batch', batch)

    const publicKeys = await createPublicKeysBatchWithSeed({
      publicKey,
      batch,
      batchSize,
      seedPrefix
    })

    const accounts = await getMultipleAccounts({
      connection,
      publicKeys: publicKeys.map(obj => obj.publicKey)
    })

    for (const [i, account] of accounts.entries()) {
      if (!account) {
        return publicKeys[i]
      }
    }
  }
}

export function createSolanaDelegateStakeTransaction ({
  stakePubkey,
  authorizedPubkey,
  delegator = FIGMENT
}) {
  return StakeProgram.delegate({
    stakePubkey,
    authorizedPubkey,
    votePubkey: new PublicKey(delegator)
  })
}

export async function createSolanaStakeTransaction ({
  publicKey,
  connection,
  lamports,
  seedPrefix = ''
} = {}) {
  if (!connection) throw new TypeError('connection argument is missing')
  if (!publicKey) throw new TypeError('publicKey argument is missing')
  if (!lamports) throw new TypeError('lamports argument is missing')

  const stakePublicKeyAndSeed = await getNextStakeAccountPublicKeyAndSeed(connection, publicKey, seedPrefix)
  log('stake account public key and seed', stakePublicKeyAndSeed)

  const transaction = new Transaction()

  transaction.add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: publicKey,
      basePubkey: publicKey,
      seed: stakePublicKeyAndSeed.seed,
      newAccountPubkey: stakePublicKeyAndSeed.publicKey,
      lamports,
      space: StakeProgram.space,
      programId: StakeProgram.programId,
    }),
  );

  transaction.add(StakeProgram.initialize({
    stakePubkey: stakePublicKeyAndSeed.publicKey,
    authorized: new Authorized(publicKey, publicKey),
  }))

  transaction.add(createSolanaDelegateStakeTransaction({
    stakePubkey: stakePublicKeyAndSeed.publicKey,
    authorizedPubkey: publicKey
  }))

  return transaction
}