import { listTokenAccounts, fetchSolBalance } from './index'

test('token-accounts exports', () => {
  expect(typeof listTokenAccounts).toEqual('function')
})
test('fetch-sol-balance exports', () => {
  expect(typeof fetchSolBalance).toEqual('function')
})
