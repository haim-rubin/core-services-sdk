import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

import { paginateCursor } from '../../src/mongodb/paginate.js'
import { startMongo, stopMongo } from '../resources/docker-mongo-test.js'
import { initializeMongoDb } from '../../src/mongodb/initialize-mongodb.js'

const MONGO_PORT = 29050
const CONTAINER_NAME = 'mongo-auth-attempts-paginate-cursor-test'

let db
let collection
describe('paginateCursor - Integration', () => {
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

    const result = await paginateCursor(collection, {
      filter: {},
      limit: 5,
      order: 'desc',
      cursorField: 'createdAt',
    })

    expect(result.list).toHaveLength(5)
    expect(result.next).toBeDefined()
    expect(result.previous).toBeNull()
  })

  it('returns empty when no docs match filter', async () => {
    const result = await paginateCursor(collection, {
      filter: { name: 'not-exist' },
      limit: 5,
      order: 'desc',
    })

    expect(result.list).toHaveLength(0)
    expect(result.next).toBeNull()
  })

  it('supports ascending order', async () => {
    const docs = await seedDocs(3)

    const ascResult = await paginateCursor(collection, {
      filter: {},
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(ascResult.list[0].name).toBe(docs[0].name)
  })

  it('supports descending order', async () => {
    const docs = await seedDocs(3)

    const descResult = await paginateCursor(collection, {
      filter: {},
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
    })

    expect(descResult.list[0].name).toBe(docs[2].name)
  })

  it('paginateCursors with cursor (next page)', async () => {
    await seedDocs(7)

    // first page
    const firstPage = await paginateCursor(collection, {
      filter: {},
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(firstPage.list).toHaveLength(3)
    expect(firstPage.next).toBeDefined()

    // second page using cursor
    const secondPage = await paginateCursor(collection, {
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

  it('paginateCursors with stringified ObjectId as cursor', async () => {
    const docs = await seedDocs(5)

    // @ts-ignore
    const stringCursor = docs[2]._id.toString()

    const page = await paginateCursor(collection, {
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

  // ---------- PAGINATION EDGES (ASC ORDER) ----------

  it('ASC - first page: has next, no previous', async () => {
    await seedDocs(7)

    const page = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(page.list).toHaveLength(3)
    expect(page.previous).toBeNull()
    expect(page.next).not.toBeNull()
  })

  it('ASC - middle page: has both next and previous', async () => {
    await seedDocs(9)

    const firstPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    const middlePage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
      cursor: firstPage.next,
    })

    expect(middlePage.list).toHaveLength(3)
    expect(middlePage.previous).not.toBeNull()
    expect(middlePage.next).not.toBeNull()
  })

  it('ASC - last page: has previous, no next', async () => {
    await seedDocs(7)

    const firstPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })
    const secondPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
      cursor: firstPage.next,
    })
    const lastPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
      cursor: secondPage.next,
    })

    expect(lastPage.list.length).toBeGreaterThan(0)
    expect(lastPage.previous).not.toBeNull()
    expect(lastPage.next).toBeNull()
  })

  it('ASC - single page: no next, no previous', async () => {
    await seedDocs(2)

    const singlePage = await paginateCursor(collection, {
      limit: 5,
      order: 'asc',
      cursorField: 'createdAt',
    })

    expect(singlePage.list).toHaveLength(2)
    expect(singlePage.previous).toBeNull()
    expect(singlePage.next).toBeNull()
  })

  // ---------- PAGINATION EDGES (DESC ORDER) ----------

  it('DESC - first page: has next, no previous', async () => {
    await seedDocs(7)

    const page = await paginateCursor(collection, {
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
    })

    expect(page.list).toHaveLength(3)
    expect(page.previous).toBeNull()
    expect(page.next).not.toBeNull()
  })

  it('DESC - middle page: has both next and previous', async () => {
    await seedDocs(9)

    const firstPage = await paginateCursor(collection, {
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
    })

    const middlePage = await paginateCursor(collection, {
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
      cursor: firstPage.next,
    })

    expect(middlePage.list).toHaveLength(3)
    expect(middlePage.previous).not.toBeNull()
    expect(middlePage.next).not.toBeNull()
  })

  it('DESC - last page: has previous, no next', async () => {
    await seedDocs(7)

    const firstPage = await paginateCursor(collection, {
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
    })
    const secondPage = await paginateCursor(collection, {
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
      cursor: firstPage.next,
    })
    const lastPage = await paginateCursor(collection, {
      limit: 3,
      order: 'desc',
      cursorField: 'createdAt',
      cursor: secondPage.next,
    })

    expect(lastPage.list.length).toBeGreaterThan(0)
    expect(lastPage.previous).not.toBeNull()
    expect(lastPage.next).toBeNull()
  })

  it('DESC - single page: no next, no previous', async () => {
    await seedDocs(2)

    const singlePage = await paginateCursor(collection, {
      limit: 5,
      order: 'desc',
      cursorField: 'createdAt',
    })

    expect(singlePage.list).toHaveLength(2)
    expect(singlePage.previous).toBeNull()
    expect(singlePage.next).toBeNull()
  })

  // ---------- STABILITY CHECKS ----------

  it('returns consistent next/previous cursors across calls', async () => {
    await seedDocs(6)

    const firstPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    const secondPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
      cursor: firstPage.next,
    })
    console.log(secondPage)
    const firstPageLast = firstPage.list[firstPage.list.length - 1].createdAt
    const secondPageFirst = secondPage.list[0].createdAt

    expect(secondPageFirst.getTime()).toBeGreaterThan(firstPageLast.getTime())
    expect(secondPage.previous).toEqual(secondPage.list[0].createdAt)
    expect(secondPage.next).toBeNull()
  })

  it('totalCount remains constant across pages', async () => {
    await seedDocs(8)

    const firstPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
    })

    const secondPage = await paginateCursor(collection, {
      limit: 3,
      order: 'asc',
      cursorField: 'createdAt',
      cursor: firstPage.next,
    })

    expect(firstPage.totalCount).toBe(8)
    expect(secondPage.totalCount).toBe(8)
  })
})
