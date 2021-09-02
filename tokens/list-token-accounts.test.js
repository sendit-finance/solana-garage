import { PublicKey } from '@solana/web3.js'
import { getRandomConnection } from '../util/get-random-connection'

import { listTokenAccounts } from './list-token-accounts'

// help deal with rate limits
import sleep from '../util/sleep'
afterEach(async () => {
  return sleep(2000)
})

test('listTokenAccounts', async () => {
  const connection = getRandomConnection()
  const tokenAccounts = await listTokenAccounts(
    connection,
    new PublicKey('2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf')
  )

  expect(tokenAccounts.length).toBeGreaterThan(10)
}, 60000)
