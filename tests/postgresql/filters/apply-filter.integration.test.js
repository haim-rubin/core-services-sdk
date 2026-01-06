// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  startPostgres,
  stopPostgres,
  buildPostgresUri,
} from '../../../src/postgresql/start-stop-postgres-docker.js'

import { applyFilter } from '../../../src/postgresql/filters/apply-filter.js'

const PG_OPTIONS = {
  port: 5446,
  db: 'testdb',
  user: 'testuser',
  pass: 'testpass',
  containerName: 'postgres-apply-filter-test-5446',
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

describe('applyFilter (integration)', () => {
  it('returns all records when filter is empty', async () => {
    const query = db('tenants')

    applyFilter({ query, filter: {} })

    const rows = await query.select('*')
    expect(rows.length).toBe(3)
  })

  it('filters by simple equality', async () => {
    const query = db('tenants')

    applyFilter({
      query,
      filter: { type: 'cpa' },
    })

    const rows = await query.select('*')
    expect(rows.map((r) => r.name)).toEqual(['Tenant C'])
  })

  it('supports comparison operators', async () => {
    const query = db('tenants')

    applyFilter({
      query,
      filter: { age: { gte: 5 } },
    })

    const names = (await query.select('*')).map((r) => r.name).sort()
    expect(names).toEqual(['Tenant B', 'Tenant C'])
  })

  it('supports IN operator via array value', async () => {
    const query = db('tenants')

    applyFilter({
      query,
      filter: { name: ['Tenant A', 'Tenant C'] },
    })

    const names = (await query.select('*')).map((r) => r.name).sort()
    expect(names).toEqual(['Tenant A', 'Tenant C'])
  })

  it('supports multiple AND conditions', async () => {
    const query = db('tenants')

    applyFilter({
      query,
      filter: {
        type: 'business',
        age: { gt: 2 },
      },
    })

    const rows = await query.select('*')
    expect(rows.map((r) => r.name)).toEqual(['Tenant B'])
  })

  it('supports OR condition mixed with AND', async () => {
    const query = db('tenants')

    applyFilter({
      query,
      filter: {
        type: 'business',
        or: [{ age: { lt: 3 } }, { age: { gt: 4 } }],
      },
    })

    const names = (await query.select('*')).map((r) => r.name).sort()
    expect(names).toEqual(['Tenant A', 'Tenant B'])
  })

  it('returns empty result when no records match', async () => {
    const query = db('tenants')

    applyFilter({
      query,
      filter: { age: { gt: 100 } },
    })

    const rows = await query.select('*')
    expect(rows).toEqual([])
  })
})
