import { getTokenByMintAddress } from '../util/tokens'
import { TokenAmount } from '../util'

import debug from '../util/log'
const log = debug.extend('tokens:fetch-sol-balance')

//
// Returns the token object consistent with the tokens
// in the tokens util file with the Solana token balance
//
let solBalancePromise

async function _fetchSolBalance(connection, publicKey) {
  log('_fetch')
  const solBalance = await connection.getBalance(publicKey, 'finalized')

  const token = await getTokenByMintAddress(
    'So11111111111111111111111111111111111111112'
  )

  token.amount = new TokenAmount(solBalance, token.decimals)

  return token
}

export async function fetchSolBalance(connection, publicKey) {
  log('fetch')

  if (solBalancePromise) return solBalancePromise

  solBalancePromise = _fetchSolBalance(connection, publicKey)
  solBalancePromise.finally(() => {
    // cache result for 10 seconds
    setTimeout(() => {
      solBalancePromise = undefined
    }, 10000)
  })

  return solBalancePromise
}