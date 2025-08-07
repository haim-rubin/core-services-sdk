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

  it('should call MongoClient.connect with default serverApi options', async () => {
    const uri = 'mongodb://localhost:27017'
    await mongoConnect({ uri })

    expect(MongoClient.connect).toHaveBeenCalledWith(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
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
    })
  })

  it('should return the connected client', async () => {
    const uri = 'mongodb://localhost:27017'
    const client = await mongoConnect({ uri })

    expect(client).toBe(fakeClient)
  })
})
