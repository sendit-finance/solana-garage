import Emitter from 'eventemitter3'

import { fetchRayStakes } from './fetch-ray-stakes'
import { fetchSolStakes } from './fetch-sol-stakes'

import debug from '../util/log'
const log = debug.extend('util:staking:list-stakes')

const run = async ({ connection, publicKey, emitter }) => {
  // We execute synchronously to avoid rate limits.

  await fetchRayStakes({ connection, publicKey, emitter })

  await fetchSolStakes({
    type: 'solana',
    connection,
    publicKey,
    emitter
  })

  // Providers like Solflare use a custom stake account seed prefix
  await fetchSolStakes({
    seedPrefix: 'stake:',
    type: 'providers',
    connection,
    publicKey,
    emitter
  })

  emitter.emit('complete')
}

export function listStakes({ connection, publicKey }) {
  const emitter = new Emitter()
  emitter.stop = () => {
    emitter.isStopped = true
  }

  run({ connection, publicKey, emitter })

  // emitter.on('stake', stake)
  // emitter.on('complete')
  // emitter.stop() to instruct fetchers to discontinue account lookups
  return emitter
}
