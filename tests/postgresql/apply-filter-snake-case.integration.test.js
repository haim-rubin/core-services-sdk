// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  stopPostgres,
  startPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'

import { applyFilterSnakeCase } from '../../src/postgresql/apply-filter.js'

const PG_OPTIONS = {
  port: 5444,
  containerName: 'postgres-apply-filter-test-5444',
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

  await db.schema.createTable('assets', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('status')
    table.string('type')
    table.decimal('price', 10, 2)
    table.timestamp('created_at').notNullable()
    table.timestamp('deleted_at')
  })

  await db.schema.createTable('invoices', (table) => {
    table.uuid('id').primary()
    table.string('invoice_number').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.string('status')
    table.uuid('customer_id')
    table.timestamp('created_at').notNullable()
    table.timestamp('paid_at')
    table.timestamp('deleted_at')
  })
})

afterAll(async () => {
  if (db) {
    await db.destroy()
  }
  stopPostgres(PG_OPTIONS.containerName)
})

beforeEach(async () => {
  await db('assets').truncate()
  await db('invoices').truncate()

  await db('assets').insert([
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Asset One',
      status: 'active',
      type: 'invoice',
      price: 100.0,
      created_at: new Date('2024-01-01'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Asset Two',
      status: 'active',
      type: 'receipt',
      price: 200.0,
      created_at: new Date('2024-01-02'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Asset Three',
      status: 'pending',
      type: 'invoice',
      price: 150.0,
      created_at: new Date('2024-01-03'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Deleted Asset',
      status: 'deleted',
      type: 'receipt',
      price: 50.0,
      created_at: new Date('2024-01-04'),
      deleted_at: new Date('2024-01-05'),
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Expensive Asset',
      status: 'active',
      type: 'invoice',
      price: 500.0,
      created_at: new Date('2024-01-05'),
      deleted_at: null,
    },
  ])

  await db('invoices').insert([
    {
      id: '00000000-0000-0000-0000-000000000101',
      invoice_number: 'INV-001',
      amount: 1000.0,
      status: 'paid',
      customer_id: '00000000-0000-0000-0000-000000000201',
      created_at: new Date('2024-01-01'),
      paid_at: new Date('2024-01-02'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      invoice_number: 'INV-002',
      amount: 2500.0,
      status: 'pending',
      customer_id: '00000000-0000-0000-0000-000000000202',
      created_at: new Date('2024-01-02'),
      paid_at: null,
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      invoice_number: 'INV-003',
      amount: 500.0,
      status: 'paid',
      customer_id: '00000000-0000-0000-0000-000000000201',
      created_at: new Date('2024-01-03'),
      paid_at: new Date('2024-01-04'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      invoice_number: 'INV-004',
      amount: 3000.0,
      status: 'overdue',
      customer_id: '00000000-0000-0000-0000-000000000203',
      created_at: new Date('2024-01-04'),
      paid_at: null,
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      invoice_number: 'INV-005',
      amount: 750.0,
      status: 'cancelled',
      customer_id: '00000000-0000-0000-0000-000000000201',
      created_at: new Date('2024-01-05'),
      paid_at: null,
      deleted_at: new Date('2024-01-06'),
    },
  ])
})

describe('applyFilterSnakeCase integration', () => {
  it('applies simple equality filter (eq)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: 'active' },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(3)
    expect(results.every((r) => r.status === 'active')).toBe(true)
  })

  it('converts camelCase keys to snake_case', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { deletedAt: { isNull: true }, name: 'Asset One' },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Asset One')
  })

  it('applies not equal filter (ne)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: { ne: 'deleted' } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(4)
    expect(results.every((r) => r.status !== 'deleted')).toBe(true)
  })

  it('applies not equal filter (neq alias)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: { neq: 'deleted' } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(4)
    expect(results.every((r) => r.status !== 'deleted')).toBe(true)
  })

  it('applies IN filter with array directly', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: ['active', 'pending'] },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(4)
    expect(
      results.every((r) => r.status === 'active' || r.status === 'pending'),
    ).toBe(true)
  })

  it('applies IN filter with operator', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: { in: ['active', 'pending'] } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(4)
    expect(
      results.every((r) => r.status === 'active' || r.status === 'pending'),
    ).toBe(true)
  })

  it('applies NOT IN filter (nin)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: { nin: ['deleted', 'archived'] } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(4)
    expect(
      results.every((r) => r.status !== 'deleted' && r.status !== 'archived'),
    ).toBe(true)
  })

  it('applies greater than filter (gt)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { price: { gt: 150 } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(2)
    expect(results.every((r) => parseFloat(r.price) > 150)).toBe(true)
  })

  it('applies greater than or equal filter (gte)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { price: { gte: 150 } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(3)
    expect(results.every((r) => parseFloat(r.price) >= 150)).toBe(true)
  })

  it('applies less than filter (lt)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { price: { lt: 150 } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(2)
    expect(results.every((r) => parseFloat(r.price) < 150)).toBe(true)
  })

  it('applies less than or equal filter (lte)', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { price: { lte: 150 } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(3)
    expect(results.every((r) => parseFloat(r.price) <= 150)).toBe(true)
  })

  it('applies range filter with gte and lte', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { price: { gte: 100, lte: 200 } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(3)
    expect(
      results.every(
        (r) => parseFloat(r.price) >= 100 && parseFloat(r.price) <= 200,
      ),
    ).toBe(true)
  })

  it('applies case-sensitive LIKE filter', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { name: { like: '%Asset%' } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.name.includes('Asset'))).toBe(true)
  })

  it('applies case-insensitive ILIKE filter', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { name: { ilike: '%asset%' } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results.length).toBeGreaterThan(0)
    expect(
      results.every((r) =>
        r.name.toLowerCase().includes('asset'.toLowerCase()),
      ),
    ).toBe(true)
  })

  it('applies isNull filter when value is true', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { deletedAt: { isNull: true } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(4)
    expect(results.every((r) => r.deleted_at === null)).toBe(true)
  })

  it('applies isNotNull filter when isNull value is false', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { deletedAt: { isNull: false } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(1)
    expect(results[0].deleted_at).not.toBe(null)
  })

  it('applies isNotNull filter when value is true', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { deletedAt: { isNotNull: true } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(1)
    expect(results[0].deleted_at).not.toBe(null)
  })

  it('applies isNull filter when isNotNull value is false', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { deletedAt: { isNotNull: false } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(4)
    expect(results.every((r) => r.deleted_at === null)).toBe(true)
  })

  it('applies multiple filters together', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: {
        status: 'active',
        type: 'invoice',
        price: { gte: 100 },
      },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(2)
    expect(results.every((r) => r.status === 'active')).toBe(true)
    expect(results.every((r) => r.type === 'invoice')).toBe(true)
    expect(results.every((r) => parseFloat(r.price) >= 100)).toBe(true)
  })

  it('returns empty results when filter matches nothing', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: 'non-existing' },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(0)
  })

  it('uses qualified column names with tableName', async () => {
    const query = db('assets').select('assets.*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: 'active' },
      tableName: 'assets',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(3)
    expect(results.every((r) => r.status === 'active')).toBe(true)
  })

  it('ignores unknown operators', async () => {
    const query = db('assets').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: { unknownOperator: 'value' } },
      tableName: 'assets',
    })

    const results = await filteredQuery

    // Should return all records since unknown operator is ignored
    expect(results).toHaveLength(5)
  })

  it('works with invoices table', async () => {
    const query = db('invoices').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: 'paid', deletedAt: { isNull: true } },
      tableName: 'invoices',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(2)
    expect(results.every((r) => r.status === 'paid')).toBe(true)
    expect(results.every((r) => r.deleted_at === null)).toBe(true)
  })

  it('works with invoices table using camelCase conversion', async () => {
    const query = db('invoices').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: {
        customerId: '00000000-0000-0000-0000-000000000201',
        amount: { gte: 500 },
      },
      tableName: 'invoices',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(3)
    expect(
      results.every(
        (r) =>
          r.customer_id === '00000000-0000-0000-0000-000000000201' &&
          parseFloat(r.amount) >= 500,
      ),
    ).toBe(true)
  })

  it('works with invoices table using IN filter', async () => {
    const query = db('invoices').select('*')
    const filteredQuery = applyFilterSnakeCase({
      query,
      filter: { status: ['paid', 'pending'] },
      tableName: 'invoices',
    })

    const results = await filteredQuery

    expect(results).toHaveLength(3)
    expect(
      results.every((r) => r.status === 'paid' || r.status === 'pending'),
    ).toBe(true)
  })
})
