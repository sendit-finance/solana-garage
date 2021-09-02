import Big from 'bignumber.js'

export default class TokenAmount {
  constructor(amountInWei, decimals = 0) {
    this._decimals = decimals
    this._decimalFactor = new Big(10).exponentiatedBy(decimals)
    this._amount = new Big(amountInWei)
  }

  toEther() {
    return this._amount.dividedBy(this._decimalFactor)
  }

  toNumber() {
    return this._amount.toNumber()
  }

  get amount() {
    return this._amount
  }

  set amount(amountInWei = 0) {
    this._amount = new Big(amountInWei)
  }

  get decimals() {
    return this._decimals
  }

  set decimals(decimals = 0) {
    this._decimals = decimals
  }

  format({ decimals } = {}) {
    const value = this._amount.dividedBy(this._decimalFactor)

    if (value.isInteger()) {
      return value.toFormat(0)
    } else if (decimals === false) {
      return value.toFormat()
    } else {
      return value.toFormat(decimals ?? this._decimals)
    }
  }

  fixed() {
    return this._amount.dividedBy(this._decimalFactor).toFixed(this._decimals)
  }

  isNullOrZero() {
    return this._amount.isNaN() || this._amount.isZero()
  }

  plus(tokenAmount) {
    if (tokenAmount.decimals !== this.decimals) {
      throw new Error(
        'You can not perform addition on two token instances with different decimals.'
      )
    }

    return new this.constructor(
      this._amount.plus(tokenAmount.amount),
      this._decimals
    )
  }

  minus(tokenAmount) {
    if (tokenAmount.decimals !== this.decimals) {
      throw new Error(
        'You can not perform subtraction on two token instances with different decimals.'
      )
    }

    return new this.constructor(
      this._amount.minus(tokenAmount.amount),
      this._decimals
    )
  }

  dividedBy(tokenAmount) {
    if (tokenAmount.decimals !== this.decimals) {
      throw new Error(
        'You can not perform division on two token instances with different decimals.'
      )
    }

    return new this.constructor(
      this._amount.dividedBy(tokenAmount.amount),
      this._decimals
    )
  }

  times(tokenAmount) {
    if (tokenAmount.decimals !== this.decimals) {
      throw new Error(
        'You can not perform multiplication on two token instances with different decimals.'
      )
    }

    return new this.constructor(
      this._amount.times(tokenAmount.amount),
      this._decimals
    )
  }
}
