// @ts-nocheck
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mongoConnect } from '../../src/mongodb/connect.js'
import { startMongo, stopMongo } from '../resources/docker-mongo-test.js'

const MONGO_PORT = 29060
const CONTAINER_NAME = 'mongo-connect-integration-test'

describe('mongoConnect - Integration', () => {
  let client

  beforeAll(async () => {
    // Start a fresh Mongo container
    startMongo(MONGO_PORT, CONTAINER_NAME)
  })

  afterAll(async () => {
    if (client) {
      await client.close()
    }
    stopMongo(CONTAINER_NAME)
  })

  it('successfully connects to a running MongoDB container', async () => {
    client = await mongoConnect({
      uri: `mongodb://0.0.0.0:${MONGO_PORT}`,
    })

    const db = client.db('integration-test')
    const col = db.collection('docs')

    await col.insertOne({ name: 'hello' })
    const found = await col.findOne({ name: 'hello' })

    expect(found).toMatchObject({ name: 'hello' })
  })

  it('respects custom timeout', async () => {
    // should connect quickly
    client = await mongoConnect({
      uri: `mongodb://0.0.0.0:${MONGO_PORT}`,
      timeout: 2000,
    })

    expect(client).toBeDefined()
  })

  it('fails to connect to an invalid port with retries', async () => {
    const badPort = 29999 // unused port

    await expect(
      mongoConnect({
        uri: `mongodb://0.0.0.0:${badPort}`,
        timeout: 1000,
        retries: 2,
      }),
    ).rejects.toThrow()

    // should try initial + retries
    // we don’t assert number of attempts here because it’s handled by p-retry
  })
})
