import { PublicKey } from '@solana/web3.js'

export const COMMITMENT = 'confirmed'

const missing = (name) => {
  throw new Error(`${name} argument is missing`)
}

//
// getMultipleAccounts
// https://docs.solana.com/developing/clients/jsonrpc-api#getmultipleaccounts
//
export async function getMultipleAccounts({
  connection,
  publicKeys,
  commitment = COMMITMENT,
  encoding = 'base64'
} = {}) {
  if (!connection) return missing('connection')
  if (!publicKeys) return missing('publicKeys')
  if (!Array.isArray(publicKeys)) throw new TypeError('publicKeys must be an array')

  const accounts = []
  const chunkedKeys = []
  const chunkSize = 10
  for (let i = 0, j = publicKeys.length; i < j; i += chunkSize) {
    chunkedKeys.push(
      publicKeys.slice(i, i + chunkSize).map((key) => key.toBase58())
    )
  }

  for (const keys of chunkedKeys) {
    const args = [keys, { commitment, encoding }]

    const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args)

    if (unsafeRes.error) {
      throw new Error(
        `getMultipleAccounts failed with publicKeys ${keys}: ${unsafeRes.error.message}`
      )
    }

    if (!unsafeRes.result?.value) {
      let msg
      try {
        msg = JSON.stringify(unsafeRes)
      } catch (_) {
        msg = ''
      }

      throw new Error(
        `getMultipleAccounts failed. Missing result.value: ${msg}`
      )
    }

    for (const [idx, account] of unsafeRes.result.value.entries()) {
      if (!account) {
        accounts.push(null)
        continue
      }

      const { executable, owner, lamports } = account

      const data = account.data[1] === 'base64' ?
        Buffer.from(account.data[0], 'base64') :
        account.data

      accounts.push({
        executable,
        owner: new PublicKey(owner),
        lamports,
        data
      })
    }
  }

  return accounts.map((account, idx) => {
    if (account === null) {
      return null
    }
    return {
      publicKey: publicKeys[idx],
      account
    }
  })
}

export async function getProgramAccounts(
  connection,
  publicKey,
  programId,
  layout,
  commitment
) {
  return await connection.getProgramAccounts(new PublicKey(programId), {
    commitment,
    filters: [
      {
        memcmp: {
          offset: 40,
          bytes: publicKey
        }
      },
      {
        dataSize: layout.span
      }
    ],
    encoding: 'base64'
  })
}

export function getKeyByValue(object, value) {
  //
  // Recursively find the object key to a value.
  //
  let found
  function _find(obj, val) {
    return Object.keys(obj).some((key) => {
      if (typeof obj[key] === 'object') return _find(obj[key], val)
      if (obj[key] !== val) return
      found = key
      return true
    })
  }

  _find(object, value)

  return found
}
