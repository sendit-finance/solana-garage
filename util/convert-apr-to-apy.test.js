import { convertAprToApy } from './convert-apr-to-apy'
import Big from 'bignumber.js'

test('convertAprToApy', () => {
  const result = convertAprToApy(2.148)
  expect(result).toBeInstanceOf(Big)
  expect(result.toNumber()).toBe(2.171171014670165)

  const diffTimesPerYear = convertAprToApy(2.148, 4)
  expect(diffTimesPerYear.toNumber()).toBe(606.2548973734989)
})
