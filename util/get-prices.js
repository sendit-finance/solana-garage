let httpFetch
if (typeof window === 'undefined') {
  httpFetch = require('node-fetch')
} else {
  httpFetch = window.fetch
}

const FULL_PRICE_URL='https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana,usd-coin,bitcoin,ethereum,yearn-finance,chainlink,ripple,tether,sushi,aleph,swipe,hedget,cream-2,upbots,helium,frontier-token,akropolis,hxro,uniswap,serum,ftx-token,megaserum,usd-coin,tomochain,karma-dao,lua-token,math,keep-network,swag-finance,celsius-degree-token,reserve-rights-token,1inch,the-graph,compound-coin,pax-gold,strong,bonfida,kin,maps,oxygen,brz,tether,raydium,bitsong,3x-short-eos-token,3x-long-eos-token,3x-short-bnb-token,3x-long-bnb-token,3x-long-bitcoin-sv-token,3x-short-bitcoin-sv-token,3x-short-litecoin-token,3x-long-litecoin-token,3x-long-bitcoin-token,3x-short-bitcoin-token,3x-short-bitcoin-cash-token,3x-long-bitcoin-cash-token,3x-long-ethereum-token,3x-short-ethereum-token,3x-long-altcoin-index-token,3x-short-altcoin-index-token,3x-long-shitcoin-index-token,3x-short-shitcoin-index-token,3x-long-midcap-index-token,3x-short-midcap-index-token,3x-short-chainlink-token,3x-long-chainlink-token,3x-long-xrp-token,3x-short-xrp-token,1x-long-btc-implied-volatility-token,1x-short-btc-implied-volatility,aave,serum-ecosystem-token,holy-trinity,bilira,3x-long-dogecoin-token,perpetual-protocol,cope,cope,mango-market-caps,rope-token,media-network,step-finance,samoyedcoin,syntheify-token,mercurial,lotto,solfarm,ardcoin,solanium,solrise-finance,boring-protocol,synthetify-token,boring-protocol,solanium'

const PRICE_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='

export function getPriceUrl(tokens) {
  if (Array.isArray(tokens)) {
    const ids = tokens.map(token => {
      return token.extensions?.coingeckoId ||
        (token.symbol === 'BOP' && 'boring-protocol') ||
        (token.symbol === 'SLIM' && 'solanium') ||
        (token.symbol !== token.address && token.symbol.toLowerCase()) ||
        ''
    }).join(',')

    const url = `${PRICE_URL}${ids}`
    return url
  }

  return FULL_PRICE_URL
}

export async function getPrices(tokens) {
  const url = getPriceUrl(tokens)

  const result = await httpFetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return (await result.json()).reduce((prices, current) => {
    prices[current.symbol.toUpperCase()] = current.current_price
    return prices
  }, {})
}
