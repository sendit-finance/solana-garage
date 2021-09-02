import {
  PublicKey,
} from '@solana/web3.js'

import { expect } from '@jest/globals'

import { getRandomConnection } from '../util/get-random-connection'
import {
  createSolanaStakeTransaction ,
  getNextStakeAccountPublicKeyAndSeed
} from './create-sol-stake'

// help deal with rate limits
import sleep from '../util/sleep'
afterEach(async () => {
  return sleep(2000)
})

const publicKey = new PublicKey('FvkAdcDHctBMk4pYnnrx7bXtuNnPThAiw7CJ716hrPN2')

test('create-sol-stake: getNextStakeAccountPublicKeyAndSeed', async () => {
  const connection = getRandomConnection()
  const stakePublicKeyAndSeed = await getNextStakeAccountPublicKeyAndSeed(connection, publicKey)

  expect(stakePublicKeyAndSeed?.publicKey).toBeInstanceOf(PublicKey)
  expect(typeof stakePublicKeyAndSeed?.seed).toBe('string')
})

test('create-sol-stake: createSolanaStakeTransaction', async () => {
  const connection = getRandomConnection()
  const transaction = await createSolanaStakeTransaction({
    connection, publicKey, lamports: 3000000
  })

  expect(transaction).toBeTruthy()
  expect(transaction.instructions.length).toBe(3)
})