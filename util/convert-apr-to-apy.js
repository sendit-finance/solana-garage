import Big from 'bignumber.js'

export function convertAprToApy(apr, timesPerYear = 365) {
  //
  // Compounding
  // https://web.archive.org/web/20210118110918/http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
  //
  // ((( apr / 100 / timesPerYear ) + 1 ) ** timesPerYear - 1)) * 100
  // ((( 755,08 / 100 / 365 ) + 1 ) ^ 365 - 1 )) * 100

  const rate = Big(1).plus(
    new Big(apr).dividedBy(100).dividedBy(new Big(timesPerYear))
  )

  return rate.exponentiatedBy(365).minus(1).times(100)
}
