import { getSolanaTokens } from '../tokens/get-solana-tokens'

export async function getLpTokens() {
  const TOKENS = await getSolanaTokens()
  const NATIVE_SOL = TOKENS.SOL

  return {
    'RAY-WUSDT': {
      symbol: 'RAY-WUSDT',
      name: 'RAY-WUSDT V2 LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.WUSDT },

      mintAddress: 'CzPDyvotTcxNqtPne32yUiEVQ6jk42HZi1Y3hUu7qf7f',
      decimals: TOKENS.RAY.decimals
    },
    'RAY-SOL': {
      symbol: 'RAY-SOL',
      name: 'RAY-SOL LP',
      coin: { ...TOKENS.RAY },
      pc: { ...NATIVE_SOL },

      mintAddress: '134Cct3CSdRCbYgq5SkwmHgfwjJ7EM5cG9PzqffWqECx',
      decimals: TOKENS.RAY.decimals
    },
    'LINK-WUSDT': {
      symbol: 'LINK-WUSDT',
      name: 'LINK-WUSDT LP',
      coin: { ...TOKENS.LINK },
      pc: { ...TOKENS.WUSDT },

      mintAddress: 'EVDmwajM5U73PD34bYPugwiA4Eqqbrej4mLXXv15Z5qR',
      decimals: TOKENS.LINK.decimals
    },
    'ETH-WUSDT': {
      symbol: 'ETH-WUSDT',
      name: 'ETH-WUSDT LP',
      coin: { ...TOKENS.ETH },
      pc: { ...TOKENS.WUSDT },

      mintAddress: 'KY4XvwHy7JPzbWYAbk23jQvEb4qWJ8aCqYWREmk1Q7K',
      decimals: TOKENS.ETH.decimals
    },
    'RAY-USDC': {
      symbol: 'RAY-USDC',
      name: 'RAY-USDC LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.USDC },

      mintAddress: 'FgmBnsF5Qrnv8X9bomQfEtQTQjNNiBCWRKGpzPnE5BDg',
      decimals: TOKENS.RAY.decimals
    },
    'RAY-SRM': {
      symbol: 'RAY-SRM',
      name: 'RAY-SRM LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.SRM },

      mintAddress: '5QXBMXuCL7zfAk39jEVVEvcrz1AvBGgT9wAhLLHLyyUJ',
      decimals: TOKENS.RAY.decimals
    },
    // v3
    'RAY-WUSDT-V3': {
      symbol: 'RAY-WUSDT',
      name: 'RAY-WUSDT V3 LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.WUSDT },

      mintAddress: 'FdhKXYjCou2jQfgKWcNY7jb8F2DPLU1teTTTRfLBD2v1',
      decimals: TOKENS.RAY.decimals
    },
    'RAY-USDC-V3': {
      symbol: 'RAY-USDC',
      name: 'RAY-USDC LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.USDC },

      mintAddress: 'BZFGfXMrjG2sS7QT2eiCDEevPFnkYYF7kzJpWfYxPbcx',
      decimals: TOKENS.RAY.decimals
    },
    'RAY-SRM-V3': {
      symbol: 'RAY-SRM',
      name: 'RAY-SRM LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.SRM },

      mintAddress: 'DSX5E21RE9FB9hM8Nh8xcXQfPK6SzRaJiywemHBSsfup',
      decimals: TOKENS.RAY.decimals
    },
    'RAY-SOL-V3': {
      symbol: 'RAY-SOL',
      name: 'RAY-SOL LP',
      coin: { ...TOKENS.RAY },
      pc: { ...NATIVE_SOL },

      mintAddress: 'F5PPQHGcznZ2FxD9JaxJMXaf7XkaFFJ6zzTBcW8osQjw',
      decimals: TOKENS.RAY.decimals
    },
    'RAY-ETH-V3': {
      symbol: 'RAY-ETH',
      name: 'RAY-ETH LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.ETH },

      mintAddress: '8Q6MKy5Yxb9vG1mWzppMtMb2nrhNuCRNUkJTeiE3fuwD',
      decimals: TOKENS.RAY.decimals
    },
    // v4
    'FIDA-RAY-V4': {
      symbol: 'FIDA-RAY',
      name: 'FIDA-RAY LP',
      coin: { ...TOKENS.FIDA },
      pc: { ...TOKENS.RAY },

      mintAddress: 'DsBuznXRTmzvEdb36Dx3aVLVo1XmH7r1PRZUFugLPTFv',
      decimals: TOKENS.FIDA.decimals
    },
    'OXY-RAY-V4': {
      symbol: 'OXY-RAY',
      name: 'OXY-RAY LP',
      coin: { ...TOKENS.OXY },
      pc: { ...TOKENS.RAY },

      mintAddress: 'FwaX9W7iThTZH5MFeasxdLpxTVxRcM7ZHieTCnYog8Yb',
      decimals: TOKENS.OXY.decimals
    },
    'MAPS-RAY-V4': {
      symbol: 'MAPS-RAY',
      name: 'MAPS-RAY LP',
      coin: { ...TOKENS.MAPS },
      pc: { ...TOKENS.RAY },

      mintAddress: 'CcKK8srfVdTSsFGV3VLBb2YDbzF4T4NM2C3UEjC39RLP',
      decimals: TOKENS.MAPS.decimals
    },
    'KIN-RAY-V4': {
      symbol: 'KIN-RAY',
      name: 'KIN-RAY LP',
      coin: { ...TOKENS.KIN },
      pc: { ...TOKENS.RAY },

      mintAddress: 'CHT8sft3h3gpLYbCcZ9o27mT5s3Z6VifBVbUiDvprHPW',
      decimals: 6
    },
    'RAY-USDT-V4': {
      symbol: 'RAY-USDT',
      name: 'RAY-USDT LP',
      coin: { ...TOKENS.RAY },
      pc: { ...TOKENS.USDT },

      mintAddress: 'C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT',
      decimals: TOKENS.RAY.decimals
    },
    'SOL-USDC-V4': {
      symbol: 'SOL-USDC',
      name: 'SOL-USDC LP',
      coin: { ...NATIVE_SOL },
      pc: { ...TOKENS.USDC },

      mintAddress: '8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu',
      decimals: NATIVE_SOL.decimals
    },
    'YFI-USDC-V4': {
      symbol: 'YFI-USDC',
      name: 'YFI-USDC LP',
      coin: { ...TOKENS.YFI },
      pc: { ...TOKENS.USDC },

      mintAddress: '865j7iMmRRycSYUXzJ33ZcvLiX9JHvaLidasCyUyKaRE',
      decimals: TOKENS.YFI.decimals
    },
    'SRM-USDC-V4': {
      symbol: 'SRM-USDC',
      name: 'SRM-USDC LP',
      coin: { ...TOKENS.SRM },
      pc: { ...TOKENS.USDC },

      mintAddress: '9XnZd82j34KxNLgQfz29jGbYdxsYznTWRpvZE3SRE7JG',
      decimals: TOKENS.SRM.decimals
    },
    'FTT-USDC-V4': {
      symbol: 'FTT-USDC',
      name: 'FTT-USDC LP',
      coin: { ...TOKENS.FTT },
      pc: { ...TOKENS.USDC },

      mintAddress: '75dCoKfUHLUuZ4qEh46ovsxfgWhB4icc3SintzWRedT9',
      decimals: TOKENS.FTT.decimals
    },
    'BTC-USDC-V4': {
      symbol: 'BTC-USDC',
      name: 'BTC-USDC LP',
      coin: { ...TOKENS.BTC },
      pc: { ...TOKENS.USDC },

      mintAddress: '2hMdRdVWZqetQsaHG8kQjdZinEMBz75vsoWTCob1ijXu',
      decimals: TOKENS.BTC.decimals
    },
    'SUSHI-USDC-V4': {
      symbol: 'SUSHI-USDC',
      name: 'SUSHI-USDC LP',
      coin: { ...TOKENS.SUSHI },
      pc: { ...TOKENS.USDC },

      mintAddress: '2QVjeR9d2PbSf8em8NE8zWd8RYHjFtucDUdDgdbDD2h2',
      decimals: TOKENS.SUSHI.decimals
    },
    'TOMO-USDC-V4': {
      symbol: 'TOMO-USDC',
      name: 'TOMO-USDC LP',
      coin: { ...TOKENS.TOMO },
      pc: { ...TOKENS.USDC },

      mintAddress: 'CHyUpQFeW456zcr5XEh4RZiibH8Dzocs6Wbgz9aWpXnQ',
      decimals: TOKENS.TOMO.decimals
    },
    'LINK-USDC-V4': {
      symbol: 'LINK-USDC',
      name: 'LINK-USDC LP',
      coin: { ...TOKENS.LINK },
      pc: { ...TOKENS.USDC },

      mintAddress: 'BqjoYjqKrXtfBKXeaWeAT5sYCy7wsAYf3XjgDWsHSBRs',
      decimals: TOKENS.LINK.decimals
    },
    'ETH-USDC-V4': {
      symbol: 'ETH-USDC',
      name: 'ETH-USDC LP',
      coin: { ...TOKENS.ETH },
      pc: { ...TOKENS.USDC },

      mintAddress: '13PoKid6cZop4sj2GfoBeujnGfthUbTERdE5tpLCDLEY',
      decimals: TOKENS.ETH.decimals
    },
    'xCOPE-USDC-V4': {
      symbol: 'xCOPE-USDC',
      name: 'xCOPE-USDC LP',
      coin: { ...TOKENS.xCOPE },
      pc: { ...TOKENS.USDC },

      mintAddress: '2Vyyeuyd15Gp8aH6uKE72c4hxc8TVSLibxDP9vzspQWG',
      decimals: TOKENS.xCOPE.decimals
    },
    'SOL-USDT-V4': {
      symbol: 'SOL-USDT',
      name: 'SOL-USDT LP',
      coin: { ...NATIVE_SOL },
      pc: { ...TOKENS.USDT },

      mintAddress: 'Epm4KfTj4DMrvqn6Bwg2Tr2N8vhQuNbuK8bESFp4k33K',
      decimals: NATIVE_SOL.decimals
    },
    'YFI-USDT-V4': {
      symbol: 'YFI-USDT',
      name: 'YFI-USDT LP',
      coin: { ...TOKENS.YFI },
      pc: { ...TOKENS.USDT },

      mintAddress: 'FA1i7fej1pAbQbnY8NbyYUsTrWcasTyipKreDgy1Mgku',
      decimals: TOKENS.YFI.decimals
    },
    'SRM-USDT-V4': {
      symbol: 'SRM-USDT',
      name: 'SRM-USDT LP',
      coin: { ...TOKENS.SRM },
      pc: { ...TOKENS.USDT },

      mintAddress: 'HYSAu42BFejBS77jZAZdNAWa3iVcbSRJSzp3wtqCbWwv',
      decimals: TOKENS.SRM.decimals
    },
    'FTT-USDT-V4': {
      symbol: 'FTT-USDT',
      name: 'FTT-USDT LP',
      coin: { ...TOKENS.FTT },
      pc: { ...TOKENS.USDT },

      mintAddress: '2cTCiUnect5Lap2sk19xLby7aajNDYseFhC9Pigou11z',
      decimals: TOKENS.FTT.decimals
    },
    'BTC-USDT-V4': {
      symbol: 'BTC-USDT',
      name: 'BTC-USDT LP',
      coin: { ...TOKENS.BTC },
      pc: { ...TOKENS.USDT },

      mintAddress: 'DgGuvR9GSHimopo3Gc7gfkbKamLKrdyzWkq5yqA6LqYS',
      decimals: TOKENS.BTC.decimals
    },
    'SUSHI-USDT-V4': {
      symbol: 'SUSHI-USDT',
      name: 'SUSHI-USDT LP',
      coin: { ...TOKENS.SUSHI },
      pc: { ...TOKENS.USDT },

      mintAddress: 'Ba26poEYDy6P2o95AJUsewXgZ8DM9BCsmnU9hmC9i4Ki',
      decimals: TOKENS.SUSHI.decimals
    },
    'TOMO-USDT-V4': {
      symbol: 'TOMO-USDT',
      name: 'TOMO-USDT LP',
      coin: { ...TOKENS.TOMO },
      pc: { ...TOKENS.USDT },

      mintAddress: 'D3iGro1vn6PWJXo9QAPj3dfta6dKkHHnmiiym2EfsAmi',
      decimals: TOKENS.TOMO.decimals
    },
    'LINK-USDT-V4': {
      symbol: 'LINK-USDT',
      name: 'LINK-USDT LP',
      coin: { ...TOKENS.LINK },
      pc: { ...TOKENS.USDT },

      mintAddress: 'Dr12Sgt9gkY8WU5tRkgZf1TkVWJbvjYuPAhR3aDCwiiX',
      decimals: TOKENS.LINK.decimals
    },
    'ETH-USDT-V4': {
      symbol: 'ETH-USDT',
      name: 'ETH-USDT LP',
      coin: { ...TOKENS.ETH },
      pc: { ...TOKENS.USDT },

      mintAddress: 'nPrB78ETY8661fUgohpuVusNCZnedYCgghzRJzxWnVb',
      decimals: TOKENS.ETH.decimals
    },
    'YFI-SRM-V4': {
      symbol: 'YFI-SRM',
      name: 'YFI-SRM LP',
      coin: { ...TOKENS.YFI },
      pc: { ...TOKENS.SRM },

      mintAddress: 'EGJht91R7dKpCj8wzALkjmNdUUUcQgodqWCYweyKcRcV',
      decimals: TOKENS.YFI.decimals
    },
    'FTT-SRM-V4': {
      symbol: 'FTT-SRM',
      name: 'FTT-SRM LP',
      coin: { ...TOKENS.FTT },
      pc: { ...TOKENS.SRM },

      mintAddress: 'AsDuPg9MgPtt3jfoyctUCUgsvwqAN6RZPftqoeiPDefM',
      decimals: TOKENS.FTT.decimals
    },
    'BTC-SRM-V4': {
      symbol: 'BTC-SRM',
      name: 'BTC-SRM LP',
      coin: { ...TOKENS.BTC },
      pc: { ...TOKENS.SRM },

      mintAddress: 'AGHQxXb3GSzeiLTcLtXMS2D5GGDZxsB2fZYZxSB5weqB',
      decimals: TOKENS.BTC.decimals
    },
    'SUSHI-SRM-V4': {
      symbol: 'SUSHI-SRM',
      name: 'SUSHI-SRM LP',
      coin: { ...TOKENS.SUSHI },
      pc: { ...TOKENS.SRM },

      mintAddress: '3HYhUnUdV67j1vn8fu7ExuVGy5dJozHEyWvqEstDbWwE',
      decimals: TOKENS.SUSHI.decimals
    },
    'TOMO-SRM-V4': {
      symbol: 'TOMO-SRM',
      name: 'TOMO-SRM LP',
      coin: { ...TOKENS.TOMO },
      pc: { ...TOKENS.SRM },

      mintAddress: 'GgH9RnKrQpaMQeqmdbMvs5oo1A24hERQ9wuY2pSkeG7x',
      decimals: TOKENS.TOMO.decimals
    },
    'LINK-SRM-V4': {
      symbol: 'LINK-SRM',
      name: 'LINK-SRM LP',
      coin: { ...TOKENS.LINK },
      pc: { ...TOKENS.SRM },

      mintAddress: 'GXN6yJv12o18skTmJXaeFXZVY1iqR18CHsmCT8VVCmDD',
      decimals: TOKENS.LINK.decimals
    },
    'ETH-SRM-V4': {
      symbol: 'ETH-SRM',
      name: 'ETH-SRM LP',
      coin: { ...TOKENS.ETH },
      pc: { ...TOKENS.SRM },

      mintAddress: '9VoY3VERETuc2FoadMSYYizF26mJinY514ZpEzkHMtwG',
      decimals: TOKENS.ETH.decimals
    },
    'SRM-SOL-V4': {
      symbol: 'SRM-SOL',
      name: 'SRM-SOL LP',
      coin: { ...TOKENS.SRM },
      pc: { ...NATIVE_SOL },

      mintAddress: 'AKJHspCwDhABucCxNLXUSfEzb7Ny62RqFtC9uNjJi4fq',
      decimals: TOKENS.SRM.decimals
    },
    'STEP-USDC-V4': {
      symbol: 'STEP-USDC',
      name: 'STEP-USDC LP',
      coin: { ...TOKENS.STEP },
      pc: { ...TOKENS.USDC },

      mintAddress: '3k8BDobgihmk72jVmXYLE168bxxQUhqqyESW4dQVktqC',
      decimals: TOKENS.STEP.decimals
    },
    'MEDIA-USDC-V4': {
      symbol: 'MEDIA-USDC',
      name: 'MEDIA-USDC LP',
      coin: { ...TOKENS.MEDIA },
      pc: { ...TOKENS.USDC },

      mintAddress: 'A5zanvgtioZGiJMdEyaKN4XQmJsp1p7uVxaq2696REvQ',
      decimals: TOKENS.MEDIA.decimals
    },
    'ROPE-USDC-V4': {
      symbol: 'ROPE-USDC',
      name: 'ROPE-USDC LP',
      coin: { ...TOKENS.ROPE },
      pc: { ...TOKENS.USDC },

      mintAddress: 'Cq4HyW5xia37tKejPF2XfZeXQoPYW6KfbPvxvw5eRoUE',
      decimals: TOKENS.ROPE.decimals
    },
    'MER-USDC-V4': {
      symbol: 'MER-USDC',
      name: 'MER-USDC LP',
      coin: { ...TOKENS.MER },
      pc: { ...TOKENS.USDC },

      mintAddress: '3H9NxvaZoxMZZDZcbBDdWMKbrfNj7PCF5sbRwDr7SdDW',
      decimals: TOKENS.MER.decimals
    },
    'COPE-USDC-V4': {
      symbol: 'COPE-USDC',
      name: 'COPE-USDC LP',
      coin: { ...TOKENS.COPE },
      pc: { ...TOKENS.USDC },

      mintAddress: 'Cz1kUvHw98imKkrqqu95GQB9h1frY8RikxPojMwWKGXf',
      decimals: TOKENS.COPE.decimals
    },
    'ALEPH-USDC-V4': {
      symbol: 'ALEPH-USDC',
      name: 'ALEPH-USDC LP',
      coin: { ...TOKENS.ALEPH },
      pc: { ...TOKENS.USDC },

      mintAddress: 'iUDasAP2nXm5wvTukAHEKSdSXn8vQkRtaiShs9ceGB7',
      decimals: TOKENS.ALEPH.decimals
    },
    'TULIP-USDC-V4': {
      symbol: 'TULIP-USDC',
      name: 'TULIP-USDC LP',
      coin: { ...TOKENS.TULIP },
      pc: { ...TOKENS.USDC },

      mintAddress: '2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU',
      decimals: TOKENS.TULIP.decimals
    },
    'WOO-USDC-V4': {
      symbol: 'WOO-USDC',
      name: 'WOO-USDC LP',
      coin: { ...TOKENS.WOO },
      pc: { ...TOKENS.USDC },

      mintAddress: '7cu42ao8Jgrd5A3y3bNQsCxq5poyGZNmTydkGfJYQfzh',
      decimals: TOKENS.WOO.decimals
    },
    'SNY-USDC-V4': {
      symbol: 'SNY-USDC',
      name: 'SNY-USDC LP',
      coin: { ...TOKENS.SNY },
      pc: { ...TOKENS.USDC },

      mintAddress: 'G8qcfeFqxwbCqpxv5LpLWxUCd1PyMB5nWb5e5YyxLMKg',
      decimals: TOKENS.SNY.decimals
    },
    'BOP-RAY-V4': {
      symbol: 'BOP-RAY',
      name: 'BOP-RAY LP',
      coin: { ...TOKENS.BOP },
      pc: { ...TOKENS.RAY },

      mintAddress: '9nQPYJvysyfnXhQ6nkK5V7sZG26hmDgusfdNQijRk5LD',
      decimals: TOKENS.BOP.decimals
    },
    'SLRS-USDC-V4': {
      symbol: 'SLRS-USDC',
      name: 'SLRS-USDC LP',
      coin: { ...TOKENS.SLRS },
      pc: { ...TOKENS.USDC },

      mintAddress: '2Xxbm1hdv5wPeen5ponDSMT3VqhGMTQ7mH9stNXm9shU',
      decimals: TOKENS.SLRS.decimals
    }
  }
}
