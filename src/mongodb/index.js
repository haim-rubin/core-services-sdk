// @ts-nocheck
import { mongoConnect } from './connect.js'

/**
 * Initializes MongoDB collections and provides a transaction wrapper and read-only client accessor.
 *
 * @param {Object} options
 * @param {{ uri: string, options: { dbName: string } }} options.config - MongoDB connection config
 * @param {Record<string, string>} options.collectionNames - Map of collection keys to MongoDB collection names
 *
 * @returns {Promise<
 *   Record<string, import('mongodb').Collection> & {
 *     withTransaction: (action: ({ session: import('mongodb').ClientSession }) => Promise<void>) => Promise<void>,
 *     readonly client: import('mongodb').MongoClient
 *   }
 * >}
 *
 * @example
 * const { users, logs, withTransaction, client } = await initializeMongoDb({
 *   config: {
 *     uri: 'mongodb://localhost:27017',
 *     options: { dbName: 'mydb' },
 *   },
 *   collectionNames: {
 *     users: 'users',
 *     logs: 'system_logs',
 *   },
 * });
 *
 * await withTransaction(async ({ session }) => {
 *   await users.insertOne({ name: 'Alice' }, { session });
 *   await logs.insertOne({ event: 'UserCreated', user: 'Alice' }, { session });
 * });
 *
 * await client.close(); // Close connection manually
 */
export const initializeMongoDb = async ({ config, collectionNames }) => {
  const client = await mongoConnect(config)
  const db = client.db(config.options.dbName)

  const collectionRefs = Object.entries(collectionNames).reduce(
    (collections, [key, collectionName]) => ({
      ...collections,
      [key]: db.collection(collectionName),
    }),
    {},
  )

  const withTransaction = async (action) => {
    const session = client.startSession()
    try {
      session.startTransaction()
      await action({ session })
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }

  return {
    ...collectionRefs,
    withTransaction,
    /** @type {import('mongodb').MongoClient} */
    get client() {
      return client
    },
  }
}
