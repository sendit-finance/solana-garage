import Big from 'bignumber.js'

import TokenAmount from '../../util/token-amount'
import { convertAprToApy } from '../../util/convert-apr-to-apy'

export default class Stake {
  constructor(
    props = {
      name: '',
      depositBalance: 0,
      rewardDecimals: 0,
      lpDecimals: 0
    }
  ) {
    props.name = props.name.toUpperCase()
    Object.assign(this, props)
  }

  getTotalValue(coinPrice) {
    return this.depositBalance.times(coinPrice)
  }

  getApr() {
    return new Big(0)
  }

  getApy() {
    return convertAprToApy(this.getApr())
  }

  getPendingReward() {
    return new Big(0)
  }

  normalize({ coinPrice = 0 }) {
    const price = new Big(coinPrice)
    const apr = this.getApr()
    const apy = this.getApy()

    return {
      name: this.name,
      type: 'Stake',
      depositBalance: new TokenAmount(
        this.depositBalance.toNumber(),
        this.lpDecimals
      ),
      pendingReward: {
        format: () => 0
      },
      pendingRewardValue: { format: () => 0 },
      totalValue: new TokenAmount(this.getTotalValue(price)),
      apr,
      apy
    }
  }
}
