import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

import { paginate } from '../../src/mongodb/paginate.js'
import { startMongo, stopMongo } from '../resources/docker-mongo-test.js'
import { initializeMongoDb } from '../../src/mongodb/initialize-mongodb.js'

const MONGO_PORT = 29050
const CONTAINER_NAME = 'mongo-auth-attempts-paginate-test'

let db
let collection
describe('paginate - Integration', () => {
  beforeAll(async () => {
    startMongo(MONGO_PORT, CONTAINER_NAME)

    db = await initializeMongoDb({
      config: {
        uri: `mongodb://0.0.0.0:${MONGO_PORT}`,
        options: { dbName: 'users-management' },
      },
      collectionNames: {
        TestDocs: 'test_docs',
      },
    })

    collection = db.TestDocs
  })
  afterAll(() => {
    stopMongo(CONTAINER_NAME)
  })

  beforeEach(async () => {
    await collection.deleteMany({})
  })

  const seedDocs = async (count = 12) => {
    const docs = Array.from({ length: count }).map((_, i) => ({
      name: `doc_${i}`,
      createdAt: new Date(Date.now() + i * 1000),
    }))
    await collection.insertMany(docs)
    return docs
  }

  it('returns first page with limit', async () => {
    await seedDocs(12)

    const result = await paginate(collection, {
      filter: {},
      limit: 5,
      order: 'desc',
      cursorField: 'createdAt',
    })

    expect(result.list).toHaveLength(5)
    expect(result.next).toBeDefined()
    expect(result.previous).toBeDefined()
  })

  it('returns empty when no docs match filter', async () => {
    const result = await paginate(collection, {
      filter: { name: 'not-exist' },
      limit: 5,
      order: 'desc',
    })

    expect(result.list).toHaveLength(0)
    expect(result.next).toBeNull()
  })

  it('supports ascending order', async () => {
    const docs = await seedDocs(3)

    const ascResult = await paginate(collection, {
      filter: {},
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(ascResult.list[0].name).toBe(docs[0].name)
  })

  it('supports descending order', async () => {
    const docs = await seedDocs(3)

    const descResult = await paginate(collection, {
      filter: {},
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
    })

    expect(descResult.list[0].name).toBe(docs[2].name)
  })

  it('paginates with cursor (next page)', async () => {
    await seedDocs(7)

    // first page
    const firstPage = await paginate(collection, {
      filter: {},
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(firstPage.list).toHaveLength(3)
    expect(firstPage.next).toBeDefined()

    // second page using cursor
    const secondPage = await paginate(collection, {
      filter: {},
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
      cursor: firstPage.next,
    })

    expect(secondPage.list).toHaveLength(3)
    // validate no overlap between first and second page
    expect(secondPage.list[0]._id.toString()).not.toBe(
      firstPage.list[0]._id.toString(),
    )
    expect(secondPage.list.map((d) => d._id.toString())).not.toEqual(
      firstPage.list.map((d) => d._id.toString()),
    )
  })

  it('paginates with stringified ObjectId as cursor', async () => {
    const docs = await seedDocs(5)

    // @ts-ignore
    const stringCursor = docs[2]._id.toString()

    const page = await paginate(collection, {
      filter: {},
      limit: 2,
      order: 'asc',
      cursorField: '_id',
      cursor: stringCursor,
    })

    expect(page.list).toHaveLength(2)

    // @ts-ignore
    expect(page.list[0]._id.toString()).toBe(docs[3]._id.toString())
    // @ts-ignore
    expect(page.list[1]._id.toString()).toBe(docs[4]._id.toString())
  })
})
