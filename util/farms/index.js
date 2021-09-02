import { getFarms } from './get-farms'

export async function getFarmFromPoolId(poolId) {
  const farm = (await getFarms()).find((farm) => farm.poolId === poolId)

  if (!farm) return

  return farm
}
