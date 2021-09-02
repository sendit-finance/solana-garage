import {
  TokenAmount,
  formatToken,
  convertAprToApy,
  getTotalValue,
  getPrices,
  getMultipleAccounts,
  getProgramAccounts,
  getKeyByValue,
  COMMITMENT,
  getTokenBySymbol,
  getTokenByMintAddress,
  filterTokens,
  filterLiquidityTokens
} from './index'

test('util exports', () => {
  expect(typeof TokenAmount).toEqual('function')
  expect(typeof formatToken).toEqual('function')
  expect(typeof convertAprToApy).toEqual('function')
  expect(typeof getTotalValue).toEqual('function')
  expect(typeof getPrices).toEqual('function')
  expect(typeof getMultipleAccounts).toEqual('function')
  expect(typeof getProgramAccounts).toEqual('function')
  expect(typeof getKeyByValue).toEqual('function')
  expect(typeof COMMITMENT).toEqual('string')
  expect(typeof getTokenBySymbol).toEqual('function')
  expect(typeof getTokenByMintAddress).toEqual('function')
  expect(typeof filterTokens).toEqual('function')
  expect(typeof filterLiquidityTokens).toEqual('function')
})
