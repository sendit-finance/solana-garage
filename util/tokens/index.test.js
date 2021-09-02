import { PublicKey } from '@solana/web3.js'

import { listTokenAccounts } from '../../tokens/list-token-accounts'
import { getRandomConnection } from '../get-random-connection'
import { filterTokens } from './index'

test('filterTokens', async () => {
  const connection = getRandomConnection()

  const tokenAccounts = await listTokenAccounts(
    connection,
    new PublicKey('2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf')
  )

  const filteredTokens = await filterTokens(tokenAccounts)

  expect(typeof filteredTokens[0].symbol).not.toBe(undefined)
  expect(filteredTokens.length).toBeGreaterThan(10)
})
