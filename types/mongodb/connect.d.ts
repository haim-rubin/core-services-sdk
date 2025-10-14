export function mongoConnect({
  uri,
  serverApi,
  timeout,
  retries,
}: {
  uri: string
  serverApi?: object
  timeout?: number
  retries?: number
}): Promise<MongoClient>
import { MongoClient } from 'mongodb'
