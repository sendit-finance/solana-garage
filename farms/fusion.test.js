import { test } from '@jest/globals'
import Big from 'bignumber.js'
import { FusionPool, normalizeForFusionPool } from './fusion'

test('fusion', () => {
  const mockData = {
    farmInfo: {
      name: 'SLRS-USDC',
      poolId: '5PVVwSqwzkCvuiKEZwWkM35ApBnoWqF8XopsVZjPwA8z',
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
      },
      reward: {
        decimals: 6
      },
      rewardB: {
        decimals: 6
      }
    },
    poolAccountInfo: {
      perShare: new Big(0),
      perBlock: new Big(0),
      perShareB: new Big(54611244024649),
      perBlockB: new Big(833332)
    },
    programAccount: {
      depositBalance: new Big(201544321),
      rewardDebt: new Big(0),
      rewardDebtB: new Big(5158483)
    }
  }

  const farm = new FusionPool(
    normalizeForFusionPool(
      mockData.farmInfo,
      mockData.poolAccountInfo,
      mockData.programAccount
    )
  )

  farm.setPoolLpTokenAmount(new Big(20369237821682))
  farm.setMintAccountSupply(new Big(23900801884482))
  farm.addToCoinBalance(new Big(11871167529941))
  farm.addToPcBalance(new Big(2243527419834))
  farm.addToPcBalance(new Big(82924424943))
  farm.addToCoinBalance(new Big(569238500000))
  farm.subtractFromCoinBalance(new Big(11174064855))
  farm.subtractFromPcBalance(new Big(2034591860))

  const normalized = farm.normalize({
    coinPrice: 0.184655,
    pcPrice: 1
  })

  expect(normalized.name).toEqual('SLRS-USDC')
  expect(normalized.type).toEqual('FusionPool')
  expect(normalized.poolId).toEqual(
    '5PVVwSqwzkCvuiKEZwWkM35ApBnoWqF8XopsVZjPwA8z'
  )
  expect(normalized.lpTokenSupply.format()).toEqual('20,369,237.821682')
  expect(normalized.liquidityUsdValue.format()).toEqual('3,936,958')
  expect(normalized.stakedLpTokens.format()).toEqual('201.544321')
  expect(normalized.totalValue.format()).toEqual('45.71')
  expect(normalized.totalApr.toNumber()).toEqual(246.52159504407032)
  expect(normalized.pendingRewardA.format()).toEqual('0')
  expect(normalized.pendingRewardAValue.format()).toEqual('0')
  expect(normalized.pendingRewardB.format()).toEqual('5.848103')
  expect(normalized.pendingRewardBValue.format()).toEqual('1.079881')
  expect(normalized.totalPendingRewardValue.format()).toEqual('1.079881')
  expect(normalized.aprA.toNumber()).toEqual(0)
  expect(normalized.apyA.toNumber()).toEqual(0)
  expect(normalized.aprB.toNumber()).toEqual(246.52159504407032)
  expect(normalized.apyB.toNumber()).toEqual(1066.891177606518)
})
