import Big from 'bignumber.js'
import merge from 'lodash.merge'
import pick from 'lodash.pick'

import Stake from './stake'
import TokenAmount from '../../util/token-amount'
import { getRewardPerBlockAmount } from '../../farms/util'
import { convertAprToApy } from '../../util/convert-apr-to-apy'

export function normalizeForRayStake(
  farmInfo,
  poolAccountInfo,
  userStakeInfo,
  account
) {
  return merge(pick(farmInfo, ['name']), pick(account, ['publicKey']), {
    depositBalance: new TokenAmount(
      userStakeInfo.depositBalance,
      farmInfo.lp.decimals
    ),
    rewardDebt: new TokenAmount(
      userStakeInfo.rewardDebt,
      farmInfo.reward.decimals
    ),
    rewardPerShareNet: new Big(poolAccountInfo.rewardPerShareNet.toString()),
    rewardPerBlock: new Big(poolAccountInfo.rewardPerBlock)
  })
}

export class RayStake extends Stake {
  constructor(props) {
    props.type = 'Raydium'
    super(props)
  }

  setPoolLpTokenAmount(amount) {
    this.poolLpTokenAmount = amount
  }

  getPendingReward() {
    return new TokenAmount(
      this.depositBalance.amount
        .multipliedBy(this.rewardPerShareNet)
        .dividedBy(1e9)
        .minus(this.rewardDebt.amount),
      this.depositBalance.decimals
    )
  }

  getTotalValue(coinPrice) {
    return new TokenAmount(
      this.depositBalance
        .toEther()
        .times(coinPrice)
        .times(new Big(10).exponentiatedBy(2)),
      2
    )
  }

  getRewardValue(coinPrice) {
    const pendingReward = this.getPendingReward()
    return new TokenAmount(
      pendingReward
        .toEther()
        .times(coinPrice)
        .times(new Big(10).exponentiatedBy(2)),
      2
    )
  }

  getApr(coinPrice) {
    return getRewardPerBlockAmount(this.rewardPerBlock, coinPrice)
      .div(this.poolLpTokenAmount.amount.times(coinPrice))
      .times(100)
  }

  normalize({ coinPrice = 0 }) {
    coinPrice = new Big(coinPrice)

    if (!this.poolLpTokenAmount) {
      throw new Error('You need to set the `poolLpTokenAmount`')
    }

    return {
      name: this.name,
      type: this.type,
      publicKey: this.publicKey,
      depositBalance: this.depositBalance,
      isRewardPending: true,
      reward: this.getPendingReward(),
      rewardValue: this.getRewardValue(coinPrice),
      totalValue: this.getTotalValue(coinPrice),
      apr: this.getApr(coinPrice),
      apy: convertAprToApy(this.getApr(coinPrice))
    }
  }
}
