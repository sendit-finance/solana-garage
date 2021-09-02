import { PublicKey } from '@solana/web3.js'
import { getRandomConnection } from '../util/get-random-connection'
import { listTokenAccounts } from '../tokens/list-token-accounts'
import { filterLiquidityTokens } from '../util/liquidity'
import { listLiquidityForTokens } from './list-liquidity-for-tokens'

describe('listLiquidityForTokens', () => {
  test('is a function', () => {
    expect(typeof listLiquidityForTokens).toEqual('function')
  })

  test('tokenaccounts', async () => {
    const connection = getRandomConnection()
    const tokenAccounts = await listTokenAccounts(
      connection,
      new PublicKey('2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf')
    )

    const liquidityTokens = await filterLiquidityTokens(tokenAccounts)

    const tokens = await listLiquidityForTokens(connection, liquidityTokens)

    expect(tokens.length).toEqual(1)
  })
})
