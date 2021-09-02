import { PublicKey } from '@solana/web3.js'
import { createPublicKeysBatchWithSeed } from './keys'

const publicKey = new PublicKey('5RwaqYTu55dNCYYsQaR6R9CituLXd9xn9xzFyezSwbCZ')

test('createPublicKeysBatchWithSeed', async () => {
  expect(() => {
    createPublicKeysBatchWithSeed()
  }).toThrow('publicKey argument is missing')

  expect(() => {
    createPublicKeysBatchWithSeed({})
  }).toThrow('publicKey argument is missing')

  expect(() => {
    createPublicKeysBatchWithSeed({ publicKey: 'x' })
  }).toThrow('batch argument is missing')

  expect(() => {
    createPublicKeysBatchWithSeed({ publicKey: 'x', batch: 0 })
  }).toThrow('batchSize argument is missing')

  const p = createPublicKeysBatchWithSeed({
    publicKey,
    batch: 0,
    batchSize: 3
  })

  expect(p).toBeInstanceOf(Promise)

  const results = await p

  expect(results).toBeInstanceOf(Array)
  expect(results).toHaveLength(3)

  results.forEach((result) => expect(result.publicKey).toBeInstanceOf(PublicKey))

  expect(results[0].publicKey.toBase58()).toEqual(
    'H21KkoEZvsMh7Lrh6uorVB8LrHckc7kfpgmAVHDyjMF'
  )
  expect(results[1].publicKey.toBase58()).toEqual(
    'AXRz5i6hdPxCVqNLnMqxXkdUDLQkgdhxEMDMgN6WgiXm'
  )
  expect(results[2].publicKey.toBase58()).toEqual(
    'FSrWeW2HPEmcoEmDYQUpHGTEStieueMeSJqzFz6DUH7e'
  )
})
