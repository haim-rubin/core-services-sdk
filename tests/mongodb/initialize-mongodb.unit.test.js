// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { initializeMongoDb } from '../../src/mongodb/initialize-mongodb.js'

// Shared session spy
const sessionSpy = {
  startTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  abortTransaction: vi.fn(),
  endSession: vi.fn(),
}

// ✅ Mock path must match actual import in initializeMongoDb
vi.mock('../../src/mongodb/connect.js', () => {
  const fakeCollection = (name) => ({
    name,
    insertOne: vi.fn(),
  })

  const fakeDb = {
    collection: vi.fn((name) => fakeCollection(name)),
  }

  const fakeClient = {
    db: vi.fn(() => fakeDb),
    startSession: () => sessionSpy,
    close: vi.fn(),
  }

  return {
    mongoConnect: vi.fn(async () => fakeClient),
  }
})

import { mongoConnect } from '../../src/mongodb/connect.js'

describe('initializeMongoDb', () => {
  const config = {
    uri: 'mongodb://localhost:27017',
    options: { dbName: 'testdb' },
  }

  const collectionNames = {
    users: 'users_collection',
    logs: 'logs_collection',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize collections correctly', async () => {
    const db = await initializeMongoDb({ config, collectionNames })

    expect(mongoConnect).toHaveBeenCalledWith(config)
    expect(db.users.name).toBe('users_collection')
    expect(db.logs.name).toBe('logs_collection')
  })

  it('should expose the mongo client via getter', async () => {
    const db = await initializeMongoDb({ config, collectionNames })
    expect(db.client).toBeDefined()
    expect(db.client.db).toBeTypeOf('function')
  })

  it('should run actions within a transaction and commit on success', async () => {
    const db = await initializeMongoDb({ config, collectionNames })

    const actionMock = vi.fn(async ({ session }) => {
      expect(session).toBe(sessionSpy)
    })

    await db.withTransaction(actionMock)

    expect(sessionSpy.startTransaction).toHaveBeenCalled()
    expect(sessionSpy.commitTransaction).toHaveBeenCalled()
    expect(sessionSpy.abortTransaction).not.toHaveBeenCalled()
    expect(sessionSpy.endSession).toHaveBeenCalled()
  })

  it('should abort transaction on error', async () => {
    const db = await initializeMongoDb({ config, collectionNames })

    const actionMock = vi.fn(async () => {
      throw new Error('Intentional failure')
    })

    await expect(db.withTransaction(actionMock)).rejects.toThrow(
      'Intentional failure',
    )

    expect(sessionSpy.startTransaction).toHaveBeenCalled()
    expect(sessionSpy.commitTransaction).not.toHaveBeenCalled()
    expect(sessionSpy.abortTransaction).toHaveBeenCalled()
    expect(sessionSpy.endSession).toHaveBeenCalled()
  })
})
