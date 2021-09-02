import { TokenListProvider } from '@solana/spl-token-registry'
import debug from '../log'
const log = debug.extend('util:tokens:get-solana-tokens')

let TOKENS
export async function getSolanaTokens() {
  if (TOKENS) return TOKENS

  const tokenList = await new TokenListProvider().resolve()

  const tokens = tokenList
    .filterByChainId(101)
    .getList()
    .reduce((tokens, token) => {
      tokens[token.symbol.toUpperCase()] = token
      return tokens
    }, {})

  //
  // We are returning a proxy here because the Raydium constants sometimes
  // use tokens with camel case notation. The Solana token-list stores all tokens
  // uppercase. This allows us to lookup `xCope` and return `XCOPE`.
  //
  TOKENS = new Proxy(tokens, {
    get(target, name) {
      const token = target[name.toUpperCase()]
      if (!token) {
        if (name !== 'then') {
          // When this Proxy is resolved in a Promise, it is inspected for
          // a "then" property. we can safely ignore these checks.
          log(`Token not supported: ${name}`)
        }
      }

      return token
    }
  })

  return TOKENS
}
