// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  stopPostgres,
  startPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'

import { sqlPaginate } from '../../src/postgresql/pagination/paginate.js'

const PG_OPTIONS = {
  port: 5442,
  db: 'testdb',
  user: 'testuser',
  pass: 'testpass',
  containerName: 'postgres-paginate-test-5442',
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
    table.bigInteger('age').notNullable()
    table.timestamp('created_at').notNullable()
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
  const records = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Tenant A',
      type: 'business',
      age: 2,
      created_at: new Date('2025-01-01'),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Tenant B',
      age: 3,
      type: 'business',
      created_at: new Date('2024-01-02'),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Tenant C',
      age: 1,
      type: 'cpa',
      created_at: new Date('2023-01-03'),
    },

    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Tenant D',
      age: 7,
      type: 'cpa',
      created_at: new Date('2022-01-03'),
    },

    {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Tenant E',
      age: 0,
      type: 'cpa',
      created_at: new Date('2021-01-03'),
    },
  ]
  await db('tenants').insert(records)
})

describe('paginate integration', () => {
  it('returns first page without ordering guarantees', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      page: 2,
      limit: 2,
    })

    expect(result.totalCount).toBe(5)
    expect(result.pages).toBe(3)
    expect(result.page).toBe(2)
    expect(result.hasPrevious).toBe(true)
    expect(result.hasNext).toBe(true)
    expect(result.list).toHaveLength(2)
  })

  it('returns second page without ordering guarantees', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      page: 2,
      limit: 2,
    })

    expect(result.totalCount).toBe(5)
    expect(result.pages).toBe(3)
    expect(result.page).toBe(2)
    expect(result.hasPrevious).toBe(true)
    expect(result.hasNext).toBe(true)
    expect(result.list).toHaveLength(2)
  })

  it('applies filters correctly', async () => {
    const minDate = new Date('2024-01-01')
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      filter: {
        createdAt: { lte: new Date(), gte: minDate },
      },
      limit: 10,
      page: 1,
    })

    expect(result.totalCount).toBe(2)

    const names = result.list.map((t) => t.name).sort()
    expect(names).toEqual(['Tenant A', 'Tenant B'])
  })

  it('supports custom ordering', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      orderBy: {
        column: 'name',
        direction: 'asc',
      },
    })

    expect(result.list.map((t) => t.name)).toEqual([
      'Tenant A',
      'Tenant B',
      'Tenant C',
      'Tenant D',
      'Tenant E',
    ])
  })

  it('supports row mapping', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      mapRow: (row) => ({
        ...row,
        mapped: true,
      }),
    })

    expect(result.list.length).toBeGreaterThan(0)
    expect(result.list[0].mapped).toBe(true)
  })

  it('returns empty list when no records match filter', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      filter: { type: 'non-existing' },
    })

    expect(result.totalCount).toBe(0)
    expect(result.pages).toBe(0)
    expect(result.list).toEqual([])
    expect(result.hasNext).toBe(false)
    expect(result.hasPrevious).toBe(false)
  })
})
