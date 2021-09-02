import { listStakes, getSeedPrefix } from './index'

test('staking exports', () => {
  expect(typeof listStakes).toEqual('function')
  expect(typeof getSeedPrefix).toEqual('function')
})
