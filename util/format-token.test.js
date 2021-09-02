import formatWalletAddress from './format-token'

describe('format-token', () => {
  test('is a function', () => {
    expect(typeof formatWalletAddress).toEqual('function')
  })

  test('formats `0` correctly', () => {
    expect(formatWalletAddress(0)).toEqual('0')
  })

  test('applies decimals correctly', () => {
    expect(formatWalletAddress(11.3213, 3)).toEqual('11.321')
  })

  test('defaults to 0', () => {
    expect(formatWalletAddress()).toEqual('0')
  })

  test('strips 0 decimals', () => {
    expect(formatWalletAddress(5.0)).toEqual('5')
  })
})
