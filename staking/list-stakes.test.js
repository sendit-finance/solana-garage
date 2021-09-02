import { PublicKey } from '@solana/web3.js'
import { getRandomConnection } from '../util/get-random-connection'

import { listStakes } from './list-stakes'

// help deal with rate limits
import sleep from '../util/sleep'
afterEach(async () => {
  return sleep(2000)
})

test('listStakes', () => {
  const connection = getRandomConnection()

  return new Promise((resolve, reject) => {
    const results = []

    const stakeEmitter = listStakes({
      connection,
      publicKey: new PublicKey('FvkAdcDHctBMk4pYnnrx7bXtuNnPThAiw7CJ716hrPN2')
    })

    stakeEmitter.on('stake', (stake = {}) => {
      if (!stake.publicKey) {
        // developer error. throw so they fix it locally
        reject(new Error('Stake is missing public key'))
      }
      results.push(stake)
    })

    stakeEmitter.once('complete', () => {
      expect(results.length).toBeGreaterThan(0)
      resolve(results)
    })
  })
}, 60000)

test('listStakes (Raydium)', () => {
  const connection = getRandomConnection()

  return new Promise((resolve, reject) => {
    const results = []

    const stakeEmitter = listStakes({
      connection,
      publicKey: new PublicKey('2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf')
    })

    stakeEmitter.on('stake', (stake = {}) => {
      if (!stake.publicKey) {
        // developer error. throw so they fix it locally
        reject(new Error('Stake is missing public key'))
      }
      results.push(stake)
    })

    stakeEmitter.once('complete', () => {
      expect(results.length).toEqual(1)
      resolve(results)
    })
  })
}, 30000)
