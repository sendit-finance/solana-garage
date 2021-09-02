import { Connection } from '@solana/web3.js'

const endpoints = [
  'https://api.mainnet-beta.solana.com',
  'https://explorer-api.mainnet-beta.solana.com'
]

const connections = endpoints.map((url) => new Connection(url))

export function getRandomConnection() {
  return connections[Math.random() > 0.5 ? 0 : 1]
}
