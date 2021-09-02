import Big from 'bignumber.js'
import TokenAmount from '../util/token-amount'

export function getRewardPerBlockAmount(perBlock, price) {
  return new Big(perBlock)
    .times(2)
    .times(60)
    .times(60)
    .times(24)
    .times(365)
    .times(price)
}

export function getTotalValue(
  totalSupply,
  pc,
  pcPrice,
  coin,
  coinPrice,
  providedLiquidity
) {
  //
  // Total value:
  // c = Total Supply / SQRT(COIN * COIN2)
  // value = 2 * LP * SQRT(Price COIN * Price COIN2 ) / c
  //
  const c = new Big(totalSupply).dividedBy(
    new Big(coin).multipliedBy(new Big(pc)).squareRoot()
  )

  const value = new Big(2)
    .times(
      new Big(providedLiquidity)
        .multipliedBy(
          new Big(coinPrice).multipliedBy(new Big(pcPrice)).squareRoot()
        )
        .dividedBy(c)
    )
    .times(new Big(10).exponentiatedBy(2))

  return new TokenAmount(value, 2)
}

export function getLiquidityUsdValue(
  coinBalance,
  coinPrice,
  pcBalance,
  pcPrice,
  lpMintAccountSupply,
  poolLpTokenAmount
) {
  const liquidityCoinValue = coinBalance.times(coinPrice)
  const liquidityPcValue = pcBalance.times(pcPrice)

  const liquidityTotalValue = liquidityPcValue.plus(liquidityCoinValue)
  const liquidityTotalSupply = new Big(lpMintAccountSupply)
  const liquidityItemValue = liquidityTotalValue.div(liquidityTotalSupply)

  return poolLpTokenAmount.times(liquidityItemValue)
}
