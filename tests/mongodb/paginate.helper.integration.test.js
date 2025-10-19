import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { paginate } from '../../src/mongodb/paginate.js'
import { startMongo, stopMongo } from '../resources/docker-mongo-test.js'
import { initializeMongoDb } from '../../src/mongodb/initialize-mongodb.js'

const MONGO_PORT = 29051
const CONTAINER_NAME = 'mongo-auth-attempts-paginate-test'

let db
let collection

describe('paginate - Integration', () => {
  beforeAll(async () => {
    await startMongo(MONGO_PORT, CONTAINER_NAME)

    db = await initializeMongoDb({
      config: {
        uri: `mongodb://0.0.0.0:${MONGO_PORT}`,
        options: { dbName: 'users-management' },
      },
      collectionNames: {
        TestDocs: 'test_docs_page',
      },
    })

    collection = db.TestDocs
  })

  afterAll(async () => {
    await stopMongo(CONTAINER_NAME)
  })

  beforeEach(async () => {
    await collection.deleteMany({})
  })

  const seedDocs = async (count = 25) => {
    const docs = Array.from({ length: count }).map((_, i) => ({
      name: `doc_${i}`,
      createdAt: new Date(Date.now() + i * 1000),
    }))
    await collection.insertMany(docs)
    return docs
  }

  it('returns first page with correct size and metadata', async () => {
    await seedDocs(15)

    const result = await paginate(collection, {
      limit: 5,
      page: 1,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(result.list).toHaveLength(5)
    expect(result.currentPage).toBe(1)
    expect(result.totalPages).toBe(3)
    expect(result.hasNext).toBe(true)
    expect(result.hasPrevious).toBe(false)
  })

  it('returns middle page correctly', async () => {
    await seedDocs(15)

    const result = await paginate(collection, {
      limit: 5,
      page: 2,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(result.list).toHaveLength(5)
    expect(result.currentPage).toBe(2)
    expect(result.hasNext).toBe(true)
    expect(result.hasPrevious).toBe(true)
  })

  it('returns last page correctly', async () => {
    await seedDocs(15)

    const result = await paginate(collection, {
      limit: 5,
      page: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(result.list).toHaveLength(5)
    expect(result.hasNext).toBe(false)
    expect(result.hasPrevious).toBe(true)
  })

  it('returns empty list for page out of range', async () => {
    await seedDocs(10)

    const result = await paginate(collection, {
      limit: 5,
      page: 5,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(result.list).toHaveLength(0)
    expect(result.hasNext).toBe(false)
    expect(result.hasPrevious).toBe(true)
  })

  it('returns totalCount consistent across pages', async () => {
    await seedDocs(9)

    const page1 = await paginate(collection, {
      limit: 3,
      page: 1,
    })

    const page2 = await paginate(collection, {
      limit: 3,
      page: 2,
    })

    expect(page1.totalCount).toBe(9)
    expect(page2.totalCount).toBe(9)
  })

  it('supports descending order', async () => {
    const docs = await seedDocs(6)

    const result = await paginate(collection, {
      limit: 3,
      page: 1,
      order: 'desc',
      cursorField: 'createdAt',
    })

    expect(result.list[0].name).toBe(docs[5].name)
    expect(result.list[2].name).toBe(docs[3].name)
  })

  it('supports ascending order', async () => {
    const docs = await seedDocs(6)

    const result = await paginate(collection, {
      limit: 3,
      page: 1,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(result.list[0].name).toBe(docs[0].name)
    expect(result.list[2].name).toBe(docs[2].name)
  })

  it('returns no documents when filter excludes all', async () => {
    await seedDocs(5)

    const result = await paginate(collection, {
      filter: { name: 'not_existing' },
      limit: 3,
      page: 1,
    })

    expect(result.list).toHaveLength(0)
    expect(result.totalCount).toBe(0)
    expect(result.totalPages).toBe(0)
  })

  it('paginates deterministically across pages', async () => {
    const docs = await seedDocs(9)

    const page1 = await paginate(collection, {
      limit: 3,
      page: 1,
      order: 'asc',
      cursorField: 'createdAt',
    })

    const page2 = await paginate(collection, {
      limit: 3,
      page: 2,
      order: 'asc',
      cursorField: 'createdAt',
    })

    // ensure continuity: last of page1 == item before first of page2
    const lastOfPage1 = page1.list[page1.list.length - 1].name
    const firstOfPage2 = page2.list[0].name

    const indexDiff =
      docs.findIndex((d) => d.name === firstOfPage2) -
      docs.findIndex((d) => d.name === lastOfPage1)
    expect(indexDiff).toBe(1)
  })
})
