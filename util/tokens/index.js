import { cloneDeep } from 'lodash'
import { getPoolByNameAndLpMintAddress } from '../pools'
import { getSolanaTokens } from './get-solana-tokens'

import debug from '../log'
const log = debug.extend('util:tokens:util')

export async function getTokenBySymbol(symbol) {
  const tokens = await getSolanaTokens()
  const token = Object.values(tokens).find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase()
  )

  if (!token) return null

  return cloneDeep(token)
}

export async function getTokenByMintAddress(mintAddress) {
  const tokens = await getSolanaTokens()
  const token = Object.values(tokens).find(
    (token) => token.address === mintAddress
  )

  if (!token) return null

  return cloneDeep(token)
}

export async function filterTokens(tokenAccounts = []) {
  tokenAccounts = tokenAccounts.map(async (tokenAccount) => {
    return {
      tokenAccount,
      isLpToken: await getPoolByNameAndLpMintAddress(
        tokenAccount.symbol,
        tokenAccount.address
      )
    }
  })

  return (await Promise.all(tokenAccounts))
    .filter((tokenAccount) => {
      return !tokenAccount.isLpToken
    })
    .map((account) => account.tokenAccount)
}
