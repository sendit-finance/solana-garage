import Big from 'bignumber.js'

export default function formatToken(amount = new Big(0), decimals = 2) {
  //
  // Remove decimals if there are none, e.g. 5000.000 will become
  // 5,000
  //
  return new Big(amount).toFormat(amount % 1 === 0 ? 0 : decimals)
}
