import Big from 'bignumber.js'
import TokenAmount from '../util/token-amount'
import merge from 'lodash.merge'
import pick from 'lodash.pick'

export function normalizeForLiquidityToken(poolInfo) {
  return merge(pick(poolInfo, ['name']), {
    lpPcBalance: new TokenAmount(0, poolInfo.pc.decimals),
    lpPcSymbol: poolInfo.pc.symbol,
    lpCoinBalance: new TokenAmount(0, poolInfo.coin.decimals),
    lpCoinSymbol: poolInfo.coin.symbol,
    lpTokenAmount: new TokenAmount(0, poolInfo.lp.decimals)
  })
}

export class LiquidityToken {
  constructor(props) {
    Object.assign(this, props)
  }

  setLpTokenAmoun(amount) {
    if (!(amount instanceof TokenAmount)) {
      throw new Error('Amount needs to be instance of TokenAmount')
    }

    this.lpTokenAmount = amount
  }

  addToCoinBalance(amount) {
    if (!(amount instanceof TokenAmount)) {
      throw new Error('Amount needs to be instance of TokenAmount')
    }

    this.lpCoinBalance = this.lpCoinBalance.plus(amount)
  }

  addToPcBalance(amount) {
    if (!(amount instanceof TokenAmount)) {
      throw new Error('Amount needs to be instance of TokenAmount')
    }

    this.lpPcBalance = this.lpPcBalance.plus(amount)
  }

  subtractFromCoinBalance(amount) {
    if (!(amount instanceof TokenAmount)) {
      throw new Error('Amount needs to be instance of TokenAmount')
    }

    this.lpCoinBalance = this.lpCoinBalance.minus(amount)
  }

  subtractFromPcBalance(amount) {
    if (!(amount instanceof TokenAmount)) {
      throw new Error('Amount needs to be instance of TokenAmount')
    }

    this.lpPcBalance = this.lpPcBalance.minus(amount)
  }

  setStatus(status) {
    this.status = status
  }

  setFees(fees) {
    this.fees = fees
  }

  setTotalSupply(totalSupply) {
    this.totalSupply = totalSupply
  }

  getUserCoinPcBalance() {
    const percent = this.lpTokenAmount.dividedBy(this.totalSupply)

    return {
      coinBalance: new TokenAmount(
        this.lpCoinBalance.amount.times(percent.amount),
        this.lpCoinBalance.decimals
      ),
      pcBalance: new TokenAmount(
        this.lpPcBalance.amount.times(percent.amount),
        this.lpPcBalance.decimals
      )
    }
  }

  normalize({ coinPrice = 0, pcPrice = 0 }) {
    const { coinBalance, pcBalance } = this.getUserCoinPcBalance()

    const coinValue = new TokenAmount(
      coinBalance
        .toEther()
        .times(new Big(coinPrice))
        .times(new Big(10).exponentiatedBy(2)),
      2
    )

    const pcValue = new TokenAmount(
      pcBalance
        .toEther()
        .times(new Big(pcPrice))
        .times(new Big(10).exponentiatedBy(2)),
      2
    )

    return {
      name: this.name,
      lpCoinBalance: this.lpCoinBalance,
      lpPcBalance: this.lpPcBalance,
      lpTokenAmount: this.lpTokenAmount,
      totalSupply: this.totalSupply,
      coinBalance,
      coinSymbol: this.lpCoinSymbol,
      coinValue,
      pcBalance,
      pcSymbol: this.lpPcSymbol,
      pcValue,
      totalValue: coinValue.plus(pcValue)
    }
  }
}
