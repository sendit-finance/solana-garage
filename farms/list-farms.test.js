import { getRandomConnection } from '../util/get-random-connection'
import { listFarms } from './list-farms'

test('listFarms', async () => {
  const connection = getRandomConnection()

  const farms = await listFarms(
    connection,
    '2CSEjyDtAtgCjTKyXHZyfUVe7EERtL7rjYjJSgcBPYLf'
  )

  expect(farms.length).toEqual(11)
})
