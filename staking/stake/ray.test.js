import { PublicKey } from '@solana/web3.js'
import Big from 'bignumber.js'
import TokenAmount from '../../util/token-amount'
import { RayStake, normalizeForRayStake } from './ray'

test('ray', () => {
  const stakeProps = {
    farmInfo: {
      name: 'RAY',
      lp: {
        decimals: 6
      },
      reward: {
        decimals: 6
      }
    },
    poolAccountInfo: {
      rewardPerShareNet: new Big(88811154496),
      rewardPerBlock: new Big(60000)
    },
    userStakeInfo: {
      depositBalance: new Big(187341139),
      rewardDebt: new Big(16637394043)
    },
    account: {
      publicKey: new PublicKey('3Yvm8Aex8TDbMQMYe4zbFoXGWcDqxm4o3MuUVmged76o')
    }
  }

  const ray = new RayStake(
    normalizeForRayStake(
      stakeProps.farmInfo,
      stakeProps.poolAccountInfo,
      stakeProps.userStakeInfo,
      stakeProps.account
    )
  )

  ray.setPoolLpTokenAmount(new TokenAmount(12514131018659, 6))

  const stake = ray.normalize({ coinPrice: 3.32 })

  expect(stake.name).toEqual('RAY')
  expect(stake.type).toEqual('Raydium')
  expect(stake.isRewardPending).toEqual(true)
  expect(stake.publicKey.toBase58()).toEqual(
    '3Yvm8Aex8TDbMQMYe4zbFoXGWcDqxm4o3MuUVmged76o'
  )
  expect(stake.depositBalance.format()).toEqual('187.341139')
  expect(stake.reward.format()).toEqual('0.588796')
  expect(stake.rewardValue.format()).toEqual('1.95')
  expect(stake.totalValue.format()).toEqual('621.97')
  expect(stake.apr.toNumber()).toEqual(30.24037381706687)
  expect(stake.apy.toNumber()).toEqual(35.29380162541129)
})
