import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { buildServer } from '../resources/server.js'

describe('Integration: Fastify + normalizeOperators', () => {
  let app

  beforeAll(async () => {
    app = buildServer()
    await app.listen({ port: 0 })
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET with userId[in]=123,456 should normalize to array', async () => {
    const res = await app.inject('/users?userId[in]=123,456&status[eq]=active')
    const body = res.json()

    expect(body.dsl).toEqual({
      userId: { in: ['123', '456'] },
      status: { eq: 'active' },
    })
  })

  it('GET with userId[in]=123 should wrap in array', async () => {
    const res = await app.inject('/users?userId[in]=123')
    const body = res.json()

    expect(body.dsl).toEqual({ userId: { in: ['123'] } })
  })

  it('GET with OR query should normalize to array', async () => {
    const res = await app.inject(
      '/users?or[0][status][eq]=active&or[1][role][eq]=admin',
    )
    const body = res.json()

    expect(body.dsl).toEqual({
      or: [{ status: { eq: 'active' } }, { role: { eq: 'admin' } }],
    })
  })

  it('POST with where body should normalize', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/users/search',
      payload: {
        where: {
          userId: { in: '123' },
          age: { gte: 18 },
        },
      },
    })

    const body = res.json()

    expect(body.dsl).toEqual({
      userId: { in: ['123'] },
      age: { gte: 18 },
    })
  })
})
