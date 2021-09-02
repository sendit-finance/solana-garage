import { PublicKey } from '@solana/web3.js'
import { getTotalValue } from './get-total-value'

import { listFarms } from '../farms/list-farms'
import { listStakes } from '../staking/list-stakes'
import { listTokenAccounts } from '../tokens/list-token-accounts'
import { listLiquidityForTokens } from '../liquidity'
import { filterTokens } from './tokens'
import { filterLiquidityTokens } from './liquidity'
import { getPrices } from './get-prices'
import { getRandomConnection } from './get-random-connection'

// help deal with rate limits
import sleep from '../util/sleep'
afterEach(async () => {
  return sleep(2000)
})

function fetchStakes(connection, publicKey) {
  return new Promise((resolve, reject) => {
    const results = []

    const stakeEmitter = listStakes({
      connection,
      publicKey
    })

    stakeEmitter.on('stake', (stake = {}) => {
      if (!stake.publicKey) {
        // developer error. throw so they fix it locally
        throw new Error('Stake is missing public key')
      }
      results.push(stake)
    })

    stakeEmitter.once('complete', () => {
      resolve(results)
    })
  })
}

async function fetchAssets(publicKey) {
  const connection = getRandomConnection()

  publicKey = new PublicKey(publicKey)

  const pools = await listFarms(connection, publicKey.toBase58())
  const stakes = await fetchStakes(connection, publicKey)
  const tokenAccounts = await listTokenAccounts(connection, publicKey)

  const tokens = await filterTokens(tokenAccounts)
  const liquidityTokens = await listLiquidityForTokens(
    connection,
    await filterLiquidityTokens(tokenAccounts)
  )

  return {
    pools,
    stakes,
    tokens,
    liquidityTokens
  }
}

test('computeTotalValue', async () => {
  const { pools, stakes, tokens, liquidityTokens } = await fetchAssets(
    '2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf'
  )
  const prices = await getPrices()

  const totalValue = await getTotalValue({
    tokens,
    pools,
    stakes,
    prices,
    liquidityTokens
  })

  expect(totalValue.amount > 0).toEqual(true)
}, 60000)
