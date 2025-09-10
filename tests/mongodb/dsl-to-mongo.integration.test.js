import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { buildServer } from '../resources/server-to-mongo.js'

describe('Integration E2E: Fastify + normalizeOperators + toMongo', () => {
  let app

  beforeAll(async () => {
    app = buildServer()
    await app.listen({ port: 0 })
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET with simple comparison and AND logic', async () => {
    const res = await app.inject(
      '/search?and[0][age][gte]=18&and[1][age][lt]=65&status[eq]=active',
    )
    const body = res.json()

    expect(body.dsl).toEqual({
      and: [{ age: { gte: '18' } }, { age: { lt: '65' } }],
      status: { eq: 'active' },
    })

    expect(body.mongo).toEqual({
      $and: [{ age: { $gte: '18' } }, { age: { $lt: '65' } }],
      status: { $eq: 'active' },
    })
  })

  it('GET with OR and IN', async () => {
    const res = await app.inject(
      '/search?or[0][role][eq]=admin&or[1][role][eq]=user&userId[in]=123,456',
    )
    const body = res.json()

    expect(body.dsl).toEqual({
      or: [{ role: { eq: 'admin' } }, { role: { eq: 'user' } }],
      userId: { in: ['123', '456'] },
    })

    expect(body.mongo).toEqual({
      $or: [{ role: { $eq: 'admin' } }, { role: { $eq: 'user' } }],
      userId: { $in: ['123', '456'] },
    })
  })

  it('POST with nested AND/OR, gt/lt, exists', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/search',
      payload: {
        where: {
          and: [
            { age: { gt: 18, lt: 65 } },
            {
              or: [{ status: { eq: 'active' } }, { status: { eq: 'pending' } }],
            },
          ],
          deletedAt: { exists: false },
        },
      },
    })

    const body = res.json()

    expect(body.dsl).toEqual({
      and: [
        { age: { gt: 18, lt: 65 } },
        { or: [{ status: { eq: 'active' } }, { status: { eq: 'pending' } }] },
      ],
      deletedAt: { exists: false },
    })

    expect(body.mongo).toEqual({
      $and: [
        { age: { $gt: 18, $lt: 65 } },
        {
          $or: [{ status: { $eq: 'active' } }, { status: { $eq: 'pending' } }],
        },
      ],
      deletedAt: { $exists: false },
    })
  })
})
