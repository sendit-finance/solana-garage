import TokenAmount from './token-amount'

test('TokenAmount', () => {
  // test format()
  {
    const amt = new TokenAmount(10000, 4)
    expect(amt.format()).toEqual('1')
  }

  {
    const amt = new TokenAmount('1012000000', 9)
    expect(amt.format()).toEqual('1.012000000')
  }

  {
    const amt = new TokenAmount('1013000000', 9, false)
    expect(amt.format({ decimals: false })).toEqual('1.013')
  }

  {
    const amt = new TokenAmount('1012000000', 9, false)
    expect(amt.format({ decimals: 2 })).toEqual('1.01')
  }
})
