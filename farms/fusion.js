import Big from 'bignumber.js'
import TokenAmount from '../util/token-amount'
import merge from 'lodash.merge'
import pick from 'lodash.pick'

import {
  getRewardPerBlockAmount,
  getTotalValue,
  getLiquidityUsdValue
} from './util'

import { convertAprToApy } from '../util/convert-apr-to-apy'

export function normalizeForFusionPool(
  farmInfo,
  poolAccountInfo,
  programAccount
) {
  return merge(
    pick(poolAccountInfo, ['perShare', 'perBlock', 'perShareB', 'perBlockB']),
    pick(programAccount, ['depositBalance', 'rewardDebt', 'rewardDebtB']),
    pick(farmInfo, ['name', 'poolId']),
    {
      lpDecimals: farmInfo.lp.decimals,
      pcDecimals: farmInfo.lp.pc.decimals,
      coinDecimals: farmInfo.lp.coin.decimals,
      rewardBDecimals: farmInfo.rewardB.decimals,
      rewardDecimals: farmInfo.reward.decimals
    }
  )
}

export class FusionPool {
  constructor(
    props = {
      name,
      poolId,
      perShare,
      perBlock,
      perShareB,
      perBlockB,
      depositBalance,
      rewardDebt,
      rewardDebtB,
      lpDecimals,
      pcDecimals,
      coinDecimals,
      rewardDecimals,
      rewardBDecimals
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

  getPcBalance() {
    return this.pcBalance.div(new Big(10).exponentiatedBy(this.pcDecimals))
  }

  getCoinBalance() {
    return this.coinBalance.div(new Big(10).exponentiatedBy(this.coinDecimals))
  }

  getPendingRewardB() {
    return new Big(this.depositBalance.toNumber())
      .multipliedBy(new Big(this.perShareB.toString()))
      .dividedBy(1e15)
      .minus(this.rewardDebtB.toNumber())
  }

  getAprB() {
    return getRewardPerBlockAmount(
      new TokenAmount(this.perBlockB, this.rewardBDecimals).toEther(),
      this.coinPrice
    )
      .div(this.getLiquidityUsdValue())
      .times(100)
  }

  getPendingRewardA() {
    return new Big(this.depositBalance.toNumber())
      .multipliedBy(new Big(this.perShare.toString()))
      .dividedBy(1e15)
      .minus(this.rewardDebt.toNumber())
  }

  getAprA() {
    return getRewardPerBlockAmount(
      new TokenAmount(this.perBlock, this.rewardDecimals).toEther(),
      this.pcPrice
    )
      .div(this.getLiquidityUsdValue())
      .times(100)
  }

  getTotalApr() {
    const liquidityUsdValue = this.getLiquidityUsdValue()

    const rewardPerBlockAmount = getRewardPerBlockAmount(
      new TokenAmount(this.perBlock, this.rewardDecimals).toEther(),
      this.pcPrice
    )

    const rewardBPerBlockAmount = getRewardPerBlockAmount(
      new TokenAmount(this.perBlockB, this.rewardBDecimals).toEther(),
      this.coinPrice
    )

    return rewardPerBlockAmount
      .div(liquidityUsdValue)
      .times(100)
      .plus(rewardBPerBlockAmount.div(liquidityUsdValue).times(100))
  }

  getLiquidityUsdValue() {
    return getLiquidityUsdValue(
      this.getCoinBalance(),
      this.coinPrice,
      this.getPcBalance(),
      this.pcPrice,
      this.lpMintAccountSupply.toNumber(),
      this.poolLpTokenAmount
    )
  }

  getTotalValue() {
    const poolLpTokenAmount = this.getPoolLpTokenAmount()
    const coinBalance = this.getCoinBalance()
    const pcBalance = this.getPcBalance()

    const depositBalance = new Big(this.depositBalance.toNumber()).dividedBy(
      new Big(10).exponentiatedBy(this.lpDecimals)
    )

    return getTotalValue(
      poolLpTokenAmount,
      pcBalance,
      this.pcPrice,
      coinBalance,
      this.coinPrice,
      depositBalance
    )
  }

  normalize({ coinPrice = 0, pcPrice = 0 }) {
    this.coinPrice = new Big(coinPrice)
    this.pcPrice = new Big(pcPrice)

    return {
      name: this.name,
      type: 'FusionPool',
      poolId: this.poolId,

      lpTokenSupply: new TokenAmount(this.poolLpTokenAmount, this.lpDecimals),
      liquidityUsdValue: new TokenAmount(this.getLiquidityUsdValue()),

      stakedLpTokens: new TokenAmount(this.depositBalance, this.lpDecimals),

      totalValue: this.getTotalValue(),
      totalApr: this.getTotalApr(),

      pendingRewardA: new TokenAmount(
        this.getPendingRewardA(),
        this.pcDecimals
      ),
      pendingRewardAValue: new TokenAmount(
        this.getPendingRewardA().times(pcPrice),
        this.pcDecimals
      ),

      aprA: this.getAprA(),
      apyA: convertAprToApy(this.getAprA()),

      pendingRewardB: new TokenAmount(
        this.getPendingRewardB(),
        this.coinDecimals
      ),
      pendingRewardBValue: new TokenAmount(
        this.getPendingRewardB().times(coinPrice),
        this.coinDecimals
      ),

      aprB: this.getAprB(),
      apyB: convertAprToApy(this.getAprB()),

      totalPendingRewardValue: new TokenAmount(
        this.getPendingRewardB().times(coinPrice),
        this.coinDecimals
      )
    }
  }
}
