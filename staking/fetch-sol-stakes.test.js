import Emitter from 'eventemitter3'
import { PublicKey } from '@solana/web3.js'
import { getRandomConnection } from '../util/get-random-connection'
import { fetchSolStakes } from './fetch-sol-stakes'

test('fetchSolStakes', async () => {
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

  await fetchSolStakes({
    connection,
    publicKey: new PublicKey('FvkAdcDHctBMk4pYnnrx7bXtuNnPThAiw7CJ716hrPN2'),
    emitter
  })

  expect(results.length).toBeGreaterThan(0)
}, 60000)
