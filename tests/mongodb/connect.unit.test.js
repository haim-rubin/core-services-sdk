// @ts-nocheck
import { MongoClient, ServerApiVersion } from 'mongodb'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mongoConnect } from '../../src/mongodb/connect.js'

vi.mock('mongodb', async () => {
  const actual = await vi.importActual('mongodb')
  return {
    ...actual,
    MongoClient: {
      connect: vi.fn(),
    },
    ServerApiVersion: actual.ServerApiVersion, // use real enum
  }
})

describe('mongoConnect', () => {
  const fakeClient = { db: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
    MongoClient.connect.mockResolvedValue(fakeClient)
  })

  it('should call MongoClient.connect with default serverApi options and default timeouts', async () => {
    const uri = 'mongodb://localhost:27017'
    await mongoConnect({ uri })

    expect(MongoClient.connect).toHaveBeenCalledWith(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    })
  })

  it('should merge custom serverApi options', async () => {
    const uri = 'mongodb://localhost:27017'
    const serverApi = { strict: false }

    await mongoConnect({ uri, serverApi })

    expect(MongoClient.connect).toHaveBeenCalledWith(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    })
  })

  it('should honor custom timeout value', async () => {
    const uri = 'mongodb://localhost:27017'
    await mongoConnect({ uri, timeout: 2000 })

    expect(MongoClient.connect).toHaveBeenCalledWith(
      uri,
      expect.objectContaining({
        connectTimeoutMS: 2000,
        socketTimeoutMS: 2000,
      }),
    )
  })

  it('should return the connected client', async () => {
    const uri = 'mongodb://localhost:27017'
    const client = await mongoConnect({ uri })

    expect(client).toBe(fakeClient)
  })

  it('should retry when connection fails initially', async () => {
    const uri = 'mongodb://localhost:27017'

    // fail first attempt, succeed second
    MongoClient.connect
      .mockRejectedValueOnce(new Error('temporary error'))
      .mockResolvedValueOnce(fakeClient)

    const client = await mongoConnect({ uri, retries: 2 })

    expect(client).toBe(fakeClient)
    expect(MongoClient.connect).toHaveBeenCalledTimes(2)
  })

  it('should throw after exceeding retries', async () => {
    const uri = 'mongodb://localhost:27017'
    MongoClient.connect.mockRejectedValue(new Error('always fails'))

    await expect(
      mongoConnect({ uri, retries: 2, timeout: 100 }),
    ).rejects.toThrow(/always fails/)

    expect(MongoClient.connect).toHaveBeenCalledTimes(3) // initial + 2 retries
  })
})
