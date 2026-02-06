// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  startPostgres,
  stopPostgres,
  buildPostgresUri,
} from '../../../src/postgresql/start-stop-postgres-docker.js'

import { applyOrderBy } from '../../../src/postgresql/modifiers/apply-order-by.js'

const PG_OPTIONS = {
  port: 5447,
  db: 'testdb',
  user: 'testuser',
  pass: 'testpass',
  containerName: 'postgres-apply-order-by-test-5447',
}

const DATABASE_URI = buildPostgresUri(PG_OPTIONS)

let db

beforeAll(async () => {
  startPostgres(PG_OPTIONS)

  db = knex({
    client: 'pg',
    connection: DATABASE_URI,
  })

  await db.schema.createTable('tenants', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('type').notNullable()
    table.integer('age').notNullable()
  })
})

afterAll(async () => {
  if (db) {
    await db.destroy()
  }

  stopPostgres(PG_OPTIONS.containerName)
})

beforeEach(async () => {
  await db('tenants').truncate()

  await db('tenants').insert([
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Tenant A',
      type: 'business',
      age: 2,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Tenant B',
      type: 'business',
      age: 5,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Tenant C',
      type: 'cpa',
      age: 7,
    },
  ])
})

describe('applyOrderBy (integration)', () => {
  it('orders by column ascending by default', async () => {
    const query = db('tenants')

    applyOrderBy({
      query,
      orderBy: { column: 'age' },
    })

    const ages = (await query.select('*')).map((r) => r.age)
    expect(ages).toEqual([2, 5, 7])
  })

  it('orders by column descending', async () => {
    const query = db('tenants')

    applyOrderBy({
      query,
      orderBy: { column: 'age', direction: 'desc' },
    })

    const ages = (await query.select('*')).map((r) => r.age)
    expect(ages).toEqual([7, 5, 2])
  })

  it('supports multiple ORDER BY clauses', async () => {
    const query = db('tenants')

    applyOrderBy({
      query,
      orderBy: [
        { column: 'type', direction: 'asc' },
        { column: 'age', direction: 'desc' },
      ],
    })

    const result = await query.select('*')

    expect(result.map((r) => `${r.type}-${r.age}`)).toEqual([
      'business-5',
      'business-2',
      'cpa-7',
    ])
  })

  it('does nothing when orderBy is missing', async () => {
    const query = db('tenants')

    applyOrderBy({ query })

    const rows = await query.select('*')
    expect(rows.length).toBe(3)
  })

  it('throws error for invalid order direction', async () => {
    const query = db('tenants')

    expect(() =>
      applyOrderBy({
        query,
        orderBy: { column: 'age', direction: 'sideways' },
      }),
    ).toThrow('Invalid order direction: sideways')
  })

  it('does not execute query when invalid direction is provided', async () => {
    const query = db('tenants')

    try {
      applyOrderBy({
        query,
        orderBy: { column: 'age', direction: 'up' },
      })
    } catch {}

    const rows = await db('tenants').select('*')
    expect(rows.length).toBe(3)
  })
})
