import { getPools } from './get-pools'

export async function getPoolByNameAndLpMintAddress(poolName, lpMintAddress) {
  const pool = (await getPools()).find(
    (pool) => pool.name === poolName && pool.lp.mintAddress === lpMintAddress
  )

  if (!pool) return

  return pool
}
