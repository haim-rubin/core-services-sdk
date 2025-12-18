import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  stopPostgres,
  startPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'

import { sqlPaginate } from '../../src/postgresql/paginate.js'

const PG_OPTIONS = {
  port: 5443,
  containerName: 'postgres-paginate-test',
  user: 'testuser',
  pass: 'testpass',
  db: 'testdb',
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

  await db('tenants').insert([
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Tenant A',
      type: 'business',
      created_at: new Date('2024-01-01'),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Tenant B',
      type: 'business',
      created_at: new Date('2024-01-02'),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Tenant C',
      type: 'cpa',
      created_at: new Date('2024-01-03'),
    },
  ])
})

describe('paginate integration', () => {
  it('returns first page without ordering guarantees', async () => {
    const result = await sqlPaginate({
      db,
      tableName: 'tenants',
      page: 1,
      limit: 2,
    })

    expect(result.totalCount).toBe(3)
    expect(result.totalPages).toBe(2)
    expect(result.currentPage).toBe(1)
    expect(result.hasPrevious).toBe(false)
    expect(result.hasNext).toBe(true)

    expect(result.list).toHaveLength(2)
  })

  it('returns second page without ordering guarantees', async () => {
    const result = await sqlPaginate({
      db,
      tableName: 'tenants',
      page: 2,
      limit: 2,
    })

    expect(result.totalCount).toBe(3)
    expect(result.totalPages).toBe(2)
    expect(result.currentPage).toBe(2)
    expect(result.hasPrevious).toBe(true)
    expect(result.hasNext).toBe(false)

    expect(result.list).toHaveLength(1)
  })

  it('applies filters correctly without ordering guarantees', async () => {
    const result = await sqlPaginate({
      db,
      tableName: 'tenants',
      filter: { type: 'business' },
      limit: 10,
    })

    expect(result.totalCount).toBe(2)

    const names = result.list.map((t) => t.name).sort()
    expect(names).toEqual(['Tenant A', 'Tenant B'])
  })

  it('supports custom ordering', async () => {
    const result = await sqlPaginate({
      db,
      tableName: 'tenants',
      orderBy: {
        column: 'created_at',
        direction: 'asc',
      },
    })

    expect(result.list.map((t) => t.name)).toEqual([
      'Tenant A',
      'Tenant B',
      'Tenant C',
    ])
  })

  it('supports row mapping', async () => {
    const result = await sqlPaginate({
      db,
      tableName: 'tenants',
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
      db,
      tableName: 'tenants',
      filter: { type: 'non-existing' },
    })

    expect(result.totalCount).toBe(0)
    expect(result.totalPages).toBe(0)
    expect(result.list).toEqual([])
    expect(result.hasNext).toBe(false)
    expect(result.hasPrevious).toBe(false)
  })
})
