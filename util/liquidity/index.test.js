import { PublicKey } from '@solana/web3.js'

import { listTokenAccounts } from '../../tokens/list-token-accounts'
import { getRandomConnection } from '../get-random-connection'
import { filterLiquidityTokens } from './index'

// help deal with rate limits
import sleep from '../../util/sleep'
afterEach(async () => {
  return sleep(2000)
})

test('filterLiquidityTokens', async () => {
  const connection = getRandomConnection()

  const tokenAccounts = await listTokenAccounts(
    connection,
    new PublicKey('2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf')
  )

  const liquidity = await filterLiquidityTokens(tokenAccounts)

  expect(typeof liquidity[0].symbol).not.toBe(undefined)
  expect(liquidity.length).toEqual(1)
})
