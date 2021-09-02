import { getSolanaTokens } from './get-solana-tokens'

// help deal with rate limits
import sleep from '../../util/sleep'
afterEach(async () => {
  return sleep(2000)
})

test('getSolanaTokens', async () => {
  const tokens = await getSolanaTokens()
  expect(tokens.XCope.name).toEqual('XCOPE')
  expect(tokens.xcope.name).toEqual('XCOPE')
  expect(tokens.XCOPE.name).toEqual('XCOPE')
})
