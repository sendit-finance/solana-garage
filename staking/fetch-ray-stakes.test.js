import Emitter from 'eventemitter3'
import { PublicKey } from '@solana/web3.js'
import { getRandomConnection } from '../util/get-random-connection'
import { fetchRayStakes } from './fetch-ray-stakes'

// help deal with rate limits
import sleep from '../util/sleep'
afterEach(async () => {
  return sleep(2000)
})

test('fetchRayStakes', async () => {
  const results = []
  const connection = getRandomConnection()
  const emitter = new Emitter()

  emitter.on('stake', (stake = {}) => {
    if (!stake.publicKey) {
      // developer error. throw so they fix it locally
      reject(new Error('Stake is missing public key'))
    }
    results.push(stake)
  })

  await fetchRayStakes({
    connection,
    publicKey: new PublicKey('2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf'),
    emitter
  })

  expect(results.length).toEqual(1)
}, 60000)
