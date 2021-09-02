import Big from 'bignumber.js'
import TokenAmount from '../util/token-amount'
import merge from 'lodash.merge'
import pick from 'lodash.pick'

import { convertAprToApy } from '../util/convert-apr-to-apy'
import { getRewardPerBlockAmount } from './util'

export function normalizeForFarm(farmInfo, poolAccountInfo, programAccount) {
  return merge(
    pick(poolAccountInfo, ['rewardPerShareNet', 'rewardPerBlock']),
    pick(programAccount, ['depositBalance', 'rewardDebt']),
    pick(farmInfo, ['name', 'poolId']),
    {
      lpDecimals: farmInfo.lp.decimals,
      pcDecimals: farmInfo.lp.pc.decimals,
      coinDecimals: farmInfo.lp.coin.decimals,
      rewardDecimals: farmInfo.reward.decimals
    }
  )
}

export class Farm {
  constructor(
    props = {
      name,
      poolId,
      rewardPerShareNet,
      rewardPerBlock,
      depositBalance,
      rewardDebt,
      lpDecimals,
      pcDecimals,
      coinDecimals,
      rewardDecimals
    }
  ) {
    Object.assign(this, props)

    this.pcBalance = new Big(0)
    this.pcPrice = new Big(0)

    this.coinBalance = new Big(0)
    this.coinPrice = new Big(0)
  }

  addToCoinBalance(amount) {
    this.coinBalance = this.coinBalance.plus(amount)
  }

  addToPcBalance(amount) {
    this.pcBalance = this.pcBalance.plus(amount)
  }

  subtractFromCoinBalance(amount) {
    this.coinBalance = this.coinBalance.minus(amount)
  }

  subtractFromPcBalance(amount) {
    this.pcBalance = this.pcBalance.minus(amount)
  }

  setMintAccountSupply(supply) {
    this.lpMintAccountSupply = new Big(supply)
  }

  setPoolLpTokenAmount(amount) {
    this.poolLpTokenAmount = new Big(amount)
  }

  getPoolLpTokenAmount() {
    return this.poolLpTokenAmount.dividedBy(
      new Big(10).exponentiatedBy(this.lpDecimals)
    )
  }

  getPendingReward() {
    return new Big(this.depositBalance.toNumber())
      .multipliedBy(new Big(this.rewardPerShareNet.toString()))
      .dividedBy(1e9)
      .minus(this.rewardDebt.toNumber())
  }

  getApr() {
    return getRewardPerBlockAmount(
      new TokenAmount(this.rewardPerBlock, this.rewardDecimals).toEther(),
      this.coinPrice
    )
      .div(this.getLiquidityUsdValue())
      .times(100)
  }

  getLiquidityUsdValue() {
    const pcBalance = this.pcBalance.div(
      new Big(10).exponentiatedBy(this.pcDecimals)
    )
    const coinBalance = this.coinBalance.div(
      new Big(10).exponentiatedBy(this.coinDecimals)
    )

    const liquidityCoinValue = coinBalance.times(this.coinPrice)
    const liquidityPcValue = pcBalance.times(this.pcPrice)

    const liquidityTotalValue = liquidityPcValue.plus(liquidityCoinValue)
    const liquidityTotalSupply = new Big(this.lpMintAccountSupply.toNumber())
    const liquidityItemValue = liquidityTotalValue.div(liquidityTotalSupply)

    return this.poolLpTokenAmount.times(liquidityItemValue)
  }

  getPcBalance() {
    return this.pcBalance.div(new Big(10).exponentiatedBy(this.pcDecimals))
  }

  getCoinBalance() {
    return this.coinBalance.div(new Big(10).exponentiatedBy(this.coinDecimals))
  }

  getTotalValue() {
    //
    // Total value:
    // c = Total Supply / SQRT(COIN * COIN2)
    // value = 2 * LP * SQRT(Price COIN * Price COIN2 ) / c
    //
    const poolLpTokenAmount = this.getPoolLpTokenAmount()
    const coinBalance = this.getCoinBalance()
    const pcBalance = this.getPcBalance()

    const depositBalance = new Big(this.depositBalance.toNumber()).dividedBy(
      new Big(10).exponentiatedBy(this.lpDecimals)
    )

    const c = poolLpTokenAmount.dividedBy(
      coinBalance.multipliedBy(pcBalance).squareRoot()
    )

    const value = new Big(2)
      .times(
        new Big(depositBalance)
          .multipliedBy(this.coinPrice.multipliedBy(this.pcPrice).squareRoot())
          .dividedBy(c)
      )
      .times(new Big(10).exponentiatedBy(2))

    return new TokenAmount(value, 2)
  }

  normalize({ coinPrice = 0, pcPrice = 0 }) {
    this.coinPrice = new Big(coinPrice)
    this.pcPrice = new Big(pcPrice)

    const pendingReward = this.getPendingReward()
    const pendingRewardValue = this.getPendingReward().times(coinPrice)

    const totalPendingRewardValue = new TokenAmount(
      pendingRewardValue,
      this.pcDecimals
    )

    return {
      name: this.name,
      type: 'Farm',
      poolId: this.poolId,
      lpTokenSupply: new TokenAmount(this.poolLpTokenAmount, this.lpDecimals),
      liquidityUsdValue: new TokenAmount(this.getLiquidityUsdValue()),
      stakedLpTokens: new TokenAmount(this.depositBalance, this.lpDecimals),

      totalValue: this.getTotalValue(),
      totalApr: this.getApr(),

      pendingReward: new TokenAmount(pendingReward, this.pcDecimals),
      pendingRewardValue: new TokenAmount(pendingRewardValue, this.pcDecimals),

      totalPendingRewardValue,

      apr: this.getApr(),
      apy: convertAprToApy(this.getApr())
    }
  }
}
