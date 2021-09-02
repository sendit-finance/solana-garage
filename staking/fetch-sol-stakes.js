import Big from 'bignumber.js'

import { createPublicKeysBatchWithSeed } from '../util/keys'
import { getMultipleAccounts } from '../util/solana-rpc'

import { SolStake } from './stake/sol'

import debug from '../util/log'
const log = debug.extend('util:staking:fetch-sol-stakes')

const ONE_DAY = 1000 * 60 * 60 * 24

const fetchTransactionsForAccount = ({ connection, publicKey }) => {
  return connection
    .getConfirmedSignaturesForAddress2(publicKey, {
      limit: 25 // this might be too low but its what solana explorer uses
    })
    .then((signatures) => {
      log('signatures for %s', publicKey.toBase58(), signatures)

      return connection.getParsedConfirmedTransactions(
        signatures.map((sig) => sig.signature)
      )
    })
}

/**
 * This const is the string "sendit_savings" converted to a stringified integer
 *
 * 1505 === 'sendit_savings'
 *   .split('')
 *   .map(c => c.charCodeAt(0))
 *   .reduce((prev, curr) => { return prev + curr }, 0)
 *
 * !!! If you change this, all previous SendIt Solana Savings accounts will
 * cease to be found!!!
 */
 const SENDIT_SEED_PREFIX = '1505'

 /**
  * To associate the new stake account with the users wallet, we derive the new
  * stake account public key from the users wallet public key using a consistent seed.
  * Since a user can have multiple stake accounts, we define a seed prefix here,
  * and later, when looking up stake accounts, append a zero-based counter to it
  * to then query the public blockchain. We derive our seed from a constant which
  * will never change (the string "sendit_savings" converted to a integer) and the
  * users public key, converted to a integer.
  *
  * Considerations
  * - The seed is publicly visible in the public transaction
  * - We do not want the seed to obviously be created by SendIt
  * - Must be a consistent hash
  * - Must be less than 32 in length
  *    https://github.com/solana-labs/solana-web3.js/blob/7cc58c9/src/publickey.ts#L13
  *
  */
 export function getSeedPrefix (publicKey) {
   const bytes = publicKey.toBytes()
   const seed = bytes.reduce((prev, curr) => { return prev + curr }, 0)
   return `${SENDIT_SEED_PREFIX}${seed}`
 }

const _fetchStakeAccounts = async ({
  connection,
  publicKey,
  seedPrefix = '',
  type,
  emitter,
  filter = (item) => ({ done: false, keep: true, item })
}) => {
  if (!(publicKey && connection)) {
    return
  }

  // Small batches to help avoid rate limiting
  const batchSize = 3

  for (let batch = 0; batch < 100; batch += batchSize) {
    if (emitter.isStopped) return

    const keys = (await createPublicKeysBatchWithSeed({
      publicKey,
      seedPrefix,
      batchSize,
      batch
    })).map(obj => obj.publicKey)

    log(
      `get solana stake accounts(${type} id:${batch})`,
      keys.map((key) => key.toBase58())
    )

    const accounts = await getMultipleAccounts({
      connection,
      publicKeys: keys,
      encoding: 'jsonParsed'
    })

    log(
      `found solana stake accounts(${type} id:${batch})`,
      accounts.filter(Boolean).map((account) => {
        return {
          publicKey: account?.publicKey.toBase58(),
          account: account?.account
        }
      })
    )

    const stakeAccounts = await Promise.allSettled(
      accounts.map((result) => {
        // when result doesn't exist, it means a public key we derived did not
        // have a matching stake account
        if (!result) return Promise.resolve()

        // ensure its a stake program
        if (result.account?.data?.program !== 'stake') return Promise.resolve()

        return fetchTransactionsForAccount({
          connection,
          publicKey: result.publicKey
        }).then((transactions) => {
          log(
            `transactions(${type} id:${batch}) for %s`,
            result.publicKey.toBase58(),
            transactions.filter(Boolean)
          )

          // A stake account can be delegated, deactivated, withdrawn and
          // redelegated.  Capture the slot (used to determine transaction
          // datetime) and amount of lamports included in each important
          // transaction.  We'll look up the actual transaction block times
          // later. Note there can be multiple delegate and deactivate
          // transactions per stake account so we must check all transactions.
          const delegationWindowEvents = []

          for (const transaction of transactions) {
            const instructions =
              transaction.transaction?.message?.instructions ?? []

            for (const instruction of instructions) {
              const type = instruction.parsed?.type
              switch (type) {
                case 'delegate':
                case 'deactivate':
                  delegationWindowEvents.push({
                    type,
                    transaction: transaction,
                    slot: transaction.slot,
                    lamports: transaction.meta.postBalances[1],
                    dateTime: undefined
                  })
                  break
              }
            }
          }

          // Convert transaction slots to datetimes which we use to calculate
          // APR later.
          return Promise.all(
            delegationWindowEvents.map((evt) => {
              return connection.getBlockTime(evt.slot).then((unixTimestamp) => {
                evt.dateTime = new Date(unixTimestamp * 1000)
                return evt
              })
            })
          ).then((events) => {
            const publicKey = result.publicKey
            return connection.getStakeActivation(publicKey).then((stakeActivation) => {
              const account = result.account
              account.stakeActivation = stakeActivation
              return {
                account,
                publicKey,
                events
              }
            })
          })
        })
      })
    )

    // see if we are finished querying the solana api for stake accounts
    let stop = false
    for (const result of stakeAccounts) {
      if (result.status === 'rejected') {
        // do not allow one failed account lookup to fail all lookups
        continue
      }
      const { done, keep, item } = filter(result.value)
      if (keep) emitter.emit('stake', item)
      if (done) stop = true
    }

    if (stop) return

    // pause before next batch iteration to help avoid rate limits
    await new Promise((res) => setTimeout(res, 2000))
  }
}

const calculateApr = ({ timeStaked, earnedLamports, startLamports }) => {
  const days = Math.max(Math.floor(timeStaked / ONE_DAY), 1)
  const percentage = earnedLamports / startLamports
  const percentagePerDay = percentage / days
  const apr = percentagePerDay * 365 * 100
  return apr
}

export async function fetchSolStakes({
  connection,
  publicKey,
  seedPrefix = '',
  type,
  emitter
}) {
  if (emitter.isStopped) return

  log(
    'fetchStakeAccounts(%s) %s seedPrefix=%s',
    type,
    publicKey?.toString(),
    seedPrefix
  )

  if (!publicKey) {
    return
  }

  // BIP44 says wait until you find 20 empty accounts before stopping.
  // Let's use a little less. We'll solve for missing accounts with paging later.
  // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#Address_gap_limit
  const emptyLimit = 15
  let emptyCount = 0

  return _fetchStakeAccounts({
    type,
    connection,
    publicKey,
    seedPrefix,
    emitter,
    filter: (result) => {
      let item

      const empty = !result?.account
      if (empty) {
        emptyCount++
      } else {
        const currentBalance = result.account.lamports ?? 0

        // We depend on order. Sort by event order
        // by using the `slot` property which is an integer representing
        // estimated blocktime of the transaction.
        // https://docs.solana.com/developing/clients/jsonrpc-api#getblocktime
        const sortedEvents = result.events.sort((a, b) =>
          a.slot > b.slot ? 1 : a.slot === b.slot ? 0 : -1
        )

        // We define "stake window" as the time during which a stake account is
        // delegated. Calculate total APR & earned rewards across all stake
        // windows. Rewards accrue only during these windows.

        let isStaking = false
        let startTime = 0
        let startLamports = 0
        let totalLamportsEarned = new Big(0)
        const aprs = []
        for (const event of sortedEvents) {
          if (event.type === 'delegate') {
            isStaking = true
            startTime = event.dateTime
            startLamports = event.lamports
          } else if (event.type === 'deactivate') {
            const timeStaked = event.dateTime - startTime
            startTime = 0

            const earnedLamports = event.lamports - startLamports
            totalLamportsEarned = totalLamportsEarned.plus(earnedLamports)

            const apr = calculateApr({
              timeStaked,
              earnedLamports,
              startLamports
            })
            aprs.push(apr)

            startLamports = 0
            isStaking = false
          }
        }

        if (isStaking) {
          // We are inside a staking window. Include in current staking window in calculations
          const now = new Date()
          const timeStaked = now - startTime

          const earnedLamports = currentBalance - startLamports
          totalLamportsEarned = totalLamportsEarned.plus(earnedLamports)

          const apr = calculateApr({
            timeStaked,
            earnedLamports,
            startLamports
          })
          aprs.push(apr)
        }

        const avgAPR = aprs.length
          ? aprs.reduce((a, b) => a + b, 0) / aprs.length
          : 0

        item = new SolStake({
          type,
          avgAPR,
          totalLamportsEarned,
          currentBalance,
          publicKey: result.publicKey, // TODO show and link to solana explorer
          account: result.account,
          isStaking
          // TODO: show to which validator the sol was staked
        })
      }

      return { done: emptyCount >= emptyLimit, keep: !empty, item }
    }
  })
}
