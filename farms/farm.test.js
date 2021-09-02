import { test } from '@jest/globals'
import Big from 'bignumber.js'
import { Farm, normalizeForFarm } from './farm'

test('farm', () => {
  const mockData = {
    farmInfo: {
      name: 'RAY-USDT',
      poolId: 'AvbVWpBi2e4C9HPmZgShGdPoNydG4Yw8GJvG9HUcLgce',
      reward: {
        decimals: 6
      },
      lp: {
        decimals: 6,
        coin: {
          decimals: 6
        },
        pc: {
          decimals: 6
        }
      }
    },
    poolAccountInfo: {
      rewardPerShareNet: new Big(797507496),
      rewardPerBlock: new Big(100000)
    },
    programAccount: {
      depositBalance: new Big(6425657),
      rewardDebt: new Big(4927294)
    }
  }

  const farm = new Farm(
    normalizeForFarm(
      mockData.farmInfo,
      mockData.poolAccountInfo,
      mockData.programAccount
    )
  )

  farm.setPoolLpTokenAmount(new Big(3080182753260))
  farm.setMintAccountSupply(new Big(3174186061149))
  farm.addToCoinBalance(new Big(4702379112332))
  farm.addToPcBalance(new Big(15864086994505))
  farm.addToPcBalance(new Big(561176103600))
  farm.addToCoinBalance(new Big(209412600000))
  farm.subtractFromCoinBalance(new Big(30287494961))
  farm.subtractFromPcBalance(new Big(229239965919))

  const normalized = farm.normalize({
    coinPrice: 3.32,
    pcPrice: 1
  })

  expect(normalized.name).toEqual('RAY-USDT')
  expect(normalized.type).toEqual('Farm')
  expect(normalized.poolId).toEqual(
    'AvbVWpBi2e4C9HPmZgShGdPoNydG4Yw8GJvG9HUcLgce'
  )
  expect(normalized.lpTokenSupply.format()).toEqual('3,080,182.753260')
  expect(normalized.liquidityUsdValue.format()).toEqual('31,443,016')
  expect(normalized.stakedLpTokens.format()).toEqual('6.425657')
  expect(normalized.totalValue.format()).toEqual('67.60')
  expect(normalized.totalApr.toNumber()).toEqual(66.59636002057329)
  expect(normalized.pendingReward.format()).toEqual('0.197216')
  expect(normalized.pendingRewardValue.format()).toEqual('0.654756')
  expect(normalized.totalPendingRewardValue.format()).toEqual('0.654756')
  expect(normalized.apr.toNumber()).toEqual(66.59636002057329)
  expect(normalized.apy.toNumber()).toEqual(94.5184426995356)
})
