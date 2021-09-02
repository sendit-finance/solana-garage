import { getPriceUrl } from './get-prices'

test('getPriceUrl', async () => {
  {
    const url = getPriceUrl()
    expect(url.startsWith('https://api.coingecko.com/api/v3/coins/markets')).toEqual(true)
    expect(url.includes('solana')).toEqual(true)
  }

  {
    const url = getPriceUrl([
      { extensions: { coingeckoId: 'yes'}},
      { symbol: 'SMB', tokenAddress: 'nnn'},
      { symbol: 'BOP'}
    ])
    expect(url.startsWith('https://api.coingecko.com/api/v3/coins/markets')).toEqual(true)
    expect(url.includes('solana')).toEqual(false)
    expect(url.includes('yes')).toEqual(true)
    expect(url.includes('smb')).toEqual(true)
    expect(url.includes('boring-protocol')).toEqual(true)
  }

})