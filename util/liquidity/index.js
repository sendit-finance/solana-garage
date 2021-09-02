import { getPoolByNameAndLpMintAddress } from '../pools'

export async function filterLiquidityTokens(tokenAccounts = []) {
  tokenAccounts = tokenAccounts.map(async (tokenAccount) => {
    return {
      tokenAccount,
      lpPool: await getPoolByNameAndLpMintAddress(
        tokenAccount.symbol,
        tokenAccount.address
      )
    }
  })

  return (await Promise.all(tokenAccounts))
    .filter((tokenAccount) => {
      return tokenAccount.lpPool
    })
    .map((account) => {
      return account.tokenAccount
    })
}
