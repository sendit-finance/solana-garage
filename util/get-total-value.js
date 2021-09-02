import Big from 'bignumber.js'
import TokenAmount from './token-amount'

export function getTotalValue({
  tokens = [],
  liquidityTokens = [],
  pools = [],
  stakes = [],
  prices = {}
} = {}) {
  let value = tokens.reduce((amount, token) => {
    const price = new Big(prices[token.symbol] || 0)
    return amount.plus(token.amount.toEther().times(price))
  }, new Big(0))

  value = value.plus(
    stakes.reduce((amount, stake) => {
      if (!stake) return amount

      const price = new Big(prices[stake.name] || 0)
      stake = stake.normalize({ coinPrice: price })
      return amount.plus(stake.totalValue.toEther())
    }, new Big(0))
  )

  value = value.plus(
    liquidityTokens.reduce((amount, liquidityToken) => {
      if (!liquidityToken) return amount

      const pcPrice = new Big(prices[liquidityToken.lpPcSymbol] || 0)
      const coinPrice = new Big(prices[liquidityToken.lpCoinSymbol] || 0)
      liquidityToken = liquidityToken.normalize({ coinPrice, pcPrice })
      return amount.plus(liquidityToken.totalValue.toEther())
    }, new Big(0))
  )

  value = value.plus(
    pools.reduce((amount, pool) => {
      if (!pool) return amount

      const [coin, pc] = pool.name.split('-')
      pool = pool.normalize({ coinPrice: prices[coin], pcPrice: prices[pc] })

      return amount.plus(new Big(pool.totalValue.toEther()))
    }, new Big(0))
  )

  return new TokenAmount(value.times(new Big(10).exponentiatedBy(2)), 2)
}
