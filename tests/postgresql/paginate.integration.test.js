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
    table.integer('age').notNullable()
    table.timestamp('created_at').notNullable()
  })

  await db.schema.createTable('roles', (table) => {
    table.increments('id').primary()
    table.uuid('tenant_id').notNullable()
    table.string('role_type').notNullable()
  })

  await db.schema.createTable('tenant_tags', (table) => {
    table.increments('id').primary()
    table.uuid('tenant_id').notNullable()
    table.string('tag').notNullable()
  })
})

afterAll(async () => {
  if (db) {
    await db.destroy()
  }

  stopPostgres(PG_OPTIONS.containerName)
})

beforeEach(async () => {
  await db('tenant_tags').truncate()
  await db('roles').truncate()
  await db('tenants').truncate()

  await db('tenants').insert([
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
      type: 'business',
      age: 3,
      created_at: new Date('2024-01-02'),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Tenant C',
      type: 'cpa',
      age: 1,
      created_at: new Date('2023-01-03'),
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Tenant D',
      type: 'cpa',
      age: 7,
      created_at: new Date('2022-01-03'),
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Tenant E',
      type: 'cpa',
      age: 0,
      created_at: new Date('2021-01-03'),
    },
  ])

  await db('roles').insert([
    {
      tenant_id: '00000000-0000-0000-0000-000000000001',
      role_type: 'customer',
    },
    {
      tenant_id: '00000000-0000-0000-0000-000000000001',
      role_type: 'supplier',
    },
    {
      tenant_id: '00000000-0000-0000-0000-000000000002',
      role_type: 'customer',
    },
    {
      tenant_id: '00000000-0000-0000-0000-000000000003',
      role_type: 'supplier',
    },
  ])

  await db('tenant_tags').insert([
    { tenant_id: '00000000-0000-0000-0000-000000000001', tag: 'vip' },
    { tenant_id: '00000000-0000-0000-0000-000000000001', tag: 'active' },
    { tenant_id: '00000000-0000-0000-0000-000000000002', tag: 'active' },
  ])
})

describe('sqlPaginate integration', () => {
  it('basic pagination works', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      page: 2,
      limit: 2,
    })

    expect(result.totalCount).toBe(5)
    expect(result.pages).toBe(3)
    expect(result.page).toBe(2)
    expect(result.list).toHaveLength(2)
  })

  it('filters correctly', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      filter: { type: 'business' },
    })

    expect(result.totalCount).toBe(2)
  })

  it('orders correctly', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      orderBy: {
        column: 'name',
        direction: 'asc',
      },
    })

    expect(result.list[0].name).toBe('Tenant A')
  })

  it('supports row mapping', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      mapRow: (row) => ({
        ...row,
        mapped: true,
      }),
    })

    expect(result.list[0].mapped).toBe(true)
  })

  it('works with join', async () => {
    const baseQuery = db('tenants').innerJoin(
      'roles',
      'roles.tenant_id',
      'tenants.id',
    )

    const result = await sqlPaginate({
      baseQuery,
      limit: 10,
    })

    expect(result.totalCount).toBeGreaterThan(0)
  })

  it('filters on joined table', async () => {
    // Joined-table column filters are applied directly to baseQuery,
    // not through the filter param (which is scoped to the base table).
    const baseQuery = db('tenants')
      .innerJoin('roles', 'roles.tenant_id', 'tenants.id')
      .where('roles.role_type', 'customer')

    const result = await sqlPaginate({
      baseQuery,
      limit: 10,
    })

    const names = result.list.map((t) => t.name).sort()

    expect(names).toEqual(['Tenant A', 'Tenant B'])
  })

  it('handles duplicate rows from join', async () => {
    const baseQuery = db('tenants').innerJoin(
      'tenant_tags',
      'tenant_tags.tenant_id',
      'tenants.id',
    )

    const result = await sqlPaginate({
      baseQuery,
      limit: 10,
    })

    expect(result.totalCount).toBeGreaterThan(0)
  })

  it('paginates correctly with join', async () => {
    const baseQuery = db('tenants').innerJoin(
      'roles',
      'roles.tenant_id',
      'tenants.id',
    )

    const result = await sqlPaginate({
      baseQuery,
      limit: 1,
      page: 2,
    })

    expect(result.page).toBe(2)
    expect(result.list.length).toBe(1)
  })

  it('orders correctly with join', async () => {
    const baseQuery = db('tenants').innerJoin(
      'roles',
      'roles.tenant_id',
      'tenants.id',
    )

    const result = await sqlPaginate({
      baseQuery,
      orderBy: {
        column: 'tenants.name',
        direction: 'asc',
      },
    })

    expect(result.list[0].name).toBe('Tenant A')
  })

  it('works with double join (3 tables)', async () => {
    const baseQuery = db('tenants')
      .innerJoin('roles', 'roles.tenant_id', 'tenants.id')
      .innerJoin('tenant_tags', 'tenant_tags.tenant_id', 'tenants.id')

    const result = await sqlPaginate({
      baseQuery,
      limit: 10,
    })

    expect(result.totalCount).toBeGreaterThan(0)
  })

  it('returns empty result correctly', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      filter: { name: 'does-not-exist' },
    })

    expect(result.totalCount).toBe(0)
    expect(result.list).toEqual([])
    expect(result.pages).toBe(0)
  })

  it('exact count is correct when join produces duplicate rows', async () => {
    // tenant A has 2 tags, tenant B has 1 tag → join produces 3 rows total
    const baseQuery = db('tenants').innerJoin(
      'tenant_tags',
      'tenant_tags.tenant_id',
      'tenants.id',
    )

    const result = await sqlPaginate({
      baseQuery,
      limit: 10,
    })

    expect(result.totalCount).toBe(3)
  })

  it('orders correctly with plain column on join (auto-prefix)', async () => {
    // plain 'name' should be auto-prefixed to 'tenants.name' to avoid ambiguity
    const baseQuery = db('tenants').innerJoin(
      'roles',
      'roles.tenant_id',
      'tenants.id',
    )

    const result = await sqlPaginate({
      baseQuery,
      orderBy: { column: 'name', direction: 'asc' },
    })

    expect(result.list[0].name).toBe('Tenant A')
  })

  it('orders correctly with multiple columns (array)', async () => {
    // sort by type asc, then name desc → business: B, A then cpa: E, D, C
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      orderBy: [
        { column: 'type', direction: 'asc' },
        { column: 'name', direction: 'desc' },
      ],
    })

    expect(result.list[0].name).toBe('Tenant B')
    expect(result.list[1].name).toBe('Tenant A')
    expect(result.list[4].name).toBe('Tenant C')
  })

  it('orders correctly with SQL expression (skips auto-prefix)', async () => {
    // lower(name) is a SQL expression — must not be prefixed
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      orderBy: { column: 'lower(name)', direction: 'asc' },
    })

    expect(result.list[0].name).toBe('Tenant A')
    expect(result.list[4].name).toBe('Tenant E')
  })

  it('returns only requested columns', async () => {
    const baseQuery = db('tenants').innerJoin(
      'roles',
      'roles.tenant_id',
      'tenants.id',
    )

    // columns must be an array — a comma-separated string is not valid for Knex select
    const result = await sqlPaginate({
      baseQuery,
      columns: ['tenants.name', 'tenants.type'],
      limit: 10,
    })

    const row = result.list[0]

    expect(row).toHaveProperty('name')
    expect(row).toHaveProperty('type')
    expect(row).not.toHaveProperty('id')
    expect(row).not.toHaveProperty('role_type')
  })

  it('hasPrevious and hasNext are correct', async () => {
    // 5 tenants, limit 2 → 3 pages
    const page1 = await sqlPaginate({
      baseQuery: db('tenants'),
      page: 1,
      limit: 2,
    })

    expect(page1.hasPrevious).toBe(false)
    expect(page1.hasNext).toBe(true)

    const page2 = await sqlPaginate({
      baseQuery: db('tenants'),
      page: 2,
      limit: 2,
    })

    expect(page2.hasPrevious).toBe(true)
    expect(page2.hasNext).toBe(true)

    const page3 = await sqlPaginate({
      baseQuery: db('tenants'),
      page: 3,
      limit: 2,
    })

    expect(page3.hasPrevious).toBe(true)
    expect(page3.hasNext).toBe(false)
  })

  it('filters with multiple conditions', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      filter: { type: 'cpa', name: 'Tenant C' },
    })

    expect(result.totalCount).toBe(1)
    expect(result.list[0].name).toBe('Tenant C')
  })

  it('filters with array values (IN operator)', async () => {
    const result = await sqlPaginate({
      baseQuery: db('tenants'),
      filter: { name: ['Tenant A', 'Tenant C'] },
    })

    expect(result.totalCount).toBe(2)

    const names = result.list.map((r) => r.name).sort()

    expect(names).toEqual(['Tenant A', 'Tenant C'])
  })
})
