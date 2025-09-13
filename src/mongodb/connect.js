import pRetry from 'p-retry'
import { MongoClient, ServerApiVersion } from 'mongodb'

/**
 * Connects to MongoDB with retry and timeout support.
 *
 * @param {Object} options
 * @param {string} options.uri - MongoDB connection URI.
 * @param {object} [options.serverApi] - Optional serverApi configuration.
 * @param {number} [options.timeout=5000] - Timeout in ms for each attempt.
 * @param {number} [options.retries=3] - Number of retry attempts.
 * @returns {Promise<MongoClient>}
 */
export const mongoConnect = async ({
  uri,
  serverApi,
  timeout = 5000,
  retries = 3,
}) => {
  const attemptConnect = async () => {
    const connectPromise = MongoClient.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        ...serverApi,
      },
      connectTimeoutMS: timeout,
      socketTimeoutMS: timeout,
    })

    // Race connection vs timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(new Error(`MongoDB connection timed out after ${timeout}ms`)),
        timeout,
      ),
    )

    return Promise.race([connectPromise, timeoutPromise])
  }

  return pRetry(attemptConnect, {
    retries,
    factor: 2, // exponential backoff multiplier
    minTimeout: 500, // wait 500ms before first retry
    maxTimeout: timeout, // cap backoff at timeout value
    onFailedAttempt: (error) => {
      console.warn(
        `MongoDB connection attempt ${error.attemptNumber} failed. ` +
          `There are ${error.retriesLeft} retries left. Reason: ${error.message}`,
      )
    },
  })
}
