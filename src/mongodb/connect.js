import { MongoClient, ServerApiVersion } from 'mongodb'

/**
 * Connects to MongoDB.
 *
 * @param {Object} options
 * @param {string} options.uri - MongoDB connection URI.
 * @param {object} [options.serverApi] - Optional serverApi configuration.
 * @returns {Promise<import('mongodb').MongoClient>}
 */

export const mongoConnect = async ({ uri, serverApi }) => {
  const client = await MongoClient.connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
      ...serverApi,
    },
  })

  return client
}
