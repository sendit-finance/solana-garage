import { expect } from '@jest/globals'

import { getRandomConnection } from './get-random-connection'
import { getMultipleAccounts } from './solana-rpc'
import { PublicKey } from '@solana/web3.js'

test('util/solana-rpc -> getMultipleAccounts', async () => {
  {
    // should require a connection
    await expect(getMultipleAccounts()).rejects.toThrow('connection argument is missing')
  }

  {
    // should require publicKeys
    await expect(getMultipleAccounts({ connection: {}})).rejects.toThrow('publicKeys argument is missing')
  }

  {
    // publicKeys must be an array
    await expect(getMultipleAccounts({ connection: {}, publicKeys: {}})).rejects.toThrow('publicKeys must be an array')
  }

  {
    // should auto decode into a base64 Buffer

    const connection = getRandomConnection()
    const res = await getMultipleAccounts({
       connection,
       publicKeys: [new PublicKey('DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz')]
    })

    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(1)
    expect(res[0].publicKey).toBeTruthy
    expect(res[0].account).toBeTruthy
    expect(res[0].account.executable).toBe(false)
    expect(res[0].account.owner).toBeTruthy
    expect(res[0].account.lamports).toBeTruthy
    expect(res[0].account.data).toBeInstanceOf(Buffer)
  }

  {
    // should support parsedJson encoding

    const connection = getRandomConnection()
    const res = await getMultipleAccounts({
       connection,
       publicKeys: [new PublicKey('DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz')],
       encoding: 'jsonParsed'
    })

    expect(res[0].account.data?.parsed?.info?.mint).toBe('So11111111111111111111111111111111111111112')
  }

  {
    // should support fetching multiple accounts

    const connection = getRandomConnection()
    const res = await getMultipleAccounts({
       connection,
       publicKeys: [
         new PublicKey('DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz'),
         new PublicKey('HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz')
       ],
       encoding: 'jsonParsed'
    })

    expect(res.length).toBe(2)
  }
})
