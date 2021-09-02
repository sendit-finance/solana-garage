import { expect } from '@jest/globals'
import { getRandomConnection } from './get-random-connection'

test('getRandomConnection', () => {
  let i = 0
  const endpoints = {}
  while (i < 10) {
    let connection = getRandomConnection()
    if (!endpoints[connection._rpcEndpoint])
      endpoints[connection._rpcEndpoint] = 0

    endpoints[connection._rpcEndpoint]++
    i++
  }

  // A poor method of confirming randomness.
  for (let endpoint in endpoints) {
    expect(endpoints[endpoint] > 1).toEqual(true)
  }
})
