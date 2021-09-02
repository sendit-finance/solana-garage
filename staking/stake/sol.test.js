import { PublicKey } from '@solana/web3.js'
import Big from 'bignumber.js'
import TokenAmount from '../../util/token-amount'
import { SolStake } from './sol'

test('sol', () => {
  const sol = new SolStake({
    type: undefined,
    avgAPR: 1.528008547008547,
    totalLamportsEarned: new Big(4898),
    currentBalance: 3004898,
    publicKey: new PublicKey('EBkCbEV4NZ1yq2U9UoF8gVAzGUFioDbD4jwBjKZHiuqc'),
    isStaking: false
  })

  const stake = sol.normalize({ coinPrice: 3.32 })

  expect(stake.name).toEqual('SOL')
  expect(stake.tokenName).toEqual('Solana')
  expect(stake.type).toEqual(undefined) // TODO: Why is this undefined?
  expect(stake.isRewardPending).toEqual(false)
  expect(stake.publicKey.toBase58()).toEqual(
    'EBkCbEV4NZ1yq2U9UoF8gVAzGUFioDbD4jwBjKZHiuqc'
  )
  expect(stake.depositBalance.format()).toEqual('0.003004898')
  expect(stake.reward.format()).toEqual('0.000004898')
  expect(stake.rewardValue.format()).toEqual('0.00')
  expect(stake.totalValue.format()).toEqual('0.009976261')
  expect(stake.apr.toNumber()).toEqual(1.528008547008547)
  expect(stake.apy.toNumber()).toEqual(1.5397098103505629)
})
