import Big from 'bignumber.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import TokenAmount from '../../util/token-amount'
import { convertAprToApy } from '../../util/convert-apr-to-apy'
import Stake from './stake'

export class SolStake extends Stake {
  constructor(
    props = {
      type,
      totalLamportsEarned,
      currentBalance,
      publicKey,
      isStaking,
      avgAPR,
      account: {}
    }
  ) {
    props.name = 'sol'
    props.currentBalance = new Big(props.currentBalance ?? 0)
    props.lpDecimals = 9
    props.rewardDecimals = 2

    super(props)
    this.account = props.account
  }

  // amount of tokens earned
  getReward() {
    return this.totalLamportsEarned.dividedBy(LAMPORTS_PER_SOL)
  }

  getTotalValue(coinPrice) {
    return this.currentBalance.times(coinPrice)
  }

  // solana staking accounts support delegating, undelegating, withdrawing and
  // redelegating the remainder. therefore, it's possible to have earned more
  // SOL than is currently in your account.  we do not currently show
  // withdrawals

  normalize({ coinPrice = 0 }) {
    const price = new Big(coinPrice)
    const apr = new Big(this.avgAPR)

    return {
      name: this.name,
      tokenName: 'Solana',
      type: this.type,
      publicKey: this.publicKey,
      depositBalance: new TokenAmount(this.currentBalance, this.lpDecimals),
      isRewardPending: false,
      reward: {
        format: () => `${this.getReward().toFixed(this.lpDecimals)}`
      },
      rewardValue: new TokenAmount(
        this.getReward().times(price),
        this.rewardDecimals,
        false
      ),
      totalValue: new TokenAmount(this.getTotalValue(price), this.lpDecimals),
      apr,
      apy: convertAprToApy(apr),
      account: this.account
    }
  }
}
