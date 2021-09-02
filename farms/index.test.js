import {
  listFarms,
  getLiquidityUsdValue,
  getRewardPerBlockAmount,
  getTotalValue
} from './index'

test('farm exports', () => {
  expect(typeof listFarms).toEqual('function')
  expect(typeof getLiquidityUsdValue).toEqual('function')
  expect(typeof getRewardPerBlockAmount).toEqual('function')
  expect(typeof getTotalValue).toEqual('function')
})
