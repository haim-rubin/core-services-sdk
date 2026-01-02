// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  startPostgres,
  stopPostgres,
  buildPostgresUri,
} from '../../../src/postgresql/start-stop-postgres-docker.js'

import { applyOrFilter } from '../../../src/postgresql/filters/apply-or-filter.js'

const PG_OPTIONS = {
  port: 5445,
  db: 'testdb',
  user: 'testuser',
  pass: 'testpass',
  containerName: 'postgres-or-filter-test-5445',
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

describe('applyOrFilter (integration)', () => {
  it('returns records matching OR conditions', async () => {
    const query = db('tenants')

    applyOrFilter(query, [{ type: 'cpa' }, { age: { gte: 5 } }], 'tenants')

    const rows = await query.select('*')

    const names = rows.map((r) => r.name).sort()
    expect(names).toEqual(['Tenant B', 'Tenant C'])
  })

  it('returns empty result when no OR conditions match', async () => {
    const query = db('tenants')

    applyOrFilter(query, [{ age: { gt: 100 } }], 'tenants')

    const rows = await query.select('*')
    expect(rows).toEqual([])
  })

  it('supports array IN operator inside OR', async () => {
    const query = db('tenants')

    applyOrFilter(query, [{ name: ['Tenant A', 'Tenant C'] }], 'tenants')

    const rows = await query.select('*')
    const names = rows.map((r) => r.name).sort()

    expect(names).toEqual(['Tenant A', 'Tenant C'])
  })
})
