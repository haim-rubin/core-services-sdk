// apply-filter.integration.test.js
// @ts-nocheck

import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  startPostgres,
  stopPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'

import { applyFilter } from '../../src/postgresql/apply-filter.js'

const PG_OPTIONS = {
  port: 5443,
  containerName: 'postgres-apply-filter-test',
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
      price: 100,
      created_at: new Date('2024-01-01'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Asset Two',
      status: 'active',
      type: 'receipt',
      price: 200,
      created_at: new Date('2024-01-02'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Asset Three',
      status: 'pending',
      type: 'invoice',
      price: 150,
      created_at: new Date('2024-01-03'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Deleted Asset',
      status: 'deleted',
      type: 'receipt',
      price: 50,
      created_at: new Date('2024-01-04'),
      deleted_at: new Date('2024-01-05'),
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Expensive Asset',
      status: 'active',
      type: 'invoice',
      price: 500,
      created_at: new Date('2024-01-05'),
      deleted_at: null,
    },
  ])

  await db('invoices').insert([
    {
      id: '00000000-0000-0000-0000-000000000101',
      invoice_number: 'INV-001',
      amount: 1000,
      status: 'paid',
      customer_id: '00000000-0000-0000-0000-000000000201',
      created_at: new Date('2024-01-01'),
      paid_at: new Date('2024-01-02'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      invoice_number: 'INV-002',
      amount: 2500,
      status: 'pending',
      customer_id: '00000000-0000-0000-0000-000000000202',
      created_at: new Date('2024-01-02'),
      paid_at: null,
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      invoice_number: 'INV-003',
      amount: 500,
      status: 'paid',
      customer_id: '00000000-0000-0000-0000-000000000201',
      created_at: new Date('2024-01-03'),
      paid_at: new Date('2024-01-04'),
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      invoice_number: 'INV-004',
      amount: 3000,
      status: 'overdue',
      customer_id: '00000000-0000-0000-0000-000000000203',
      created_at: new Date('2024-01-04'),
      paid_at: null,
      deleted_at: null,
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      invoice_number: 'INV-005',
      amount: 750,
      status: 'cancelled',
      customer_id: '00000000-0000-0000-0000-000000000201',
      created_at: new Date('2024-01-05'),
      paid_at: null,
      deleted_at: new Date('2024-01-06'),
    },
  ])
})

describe('applyFilter integration (snake_case only)', () => {
  it('applies equality filter', async () => {
    const results = await applyFilter({
      query: db('assets').select('*'),
      filter: { status: 'active' },
      tableName: 'assets',
    })

    expect(results).toHaveLength(3)
  })

  it('applies IN filter', async () => {
    const results = await applyFilter({
      query: db('assets').select('*'),
      filter: { status: ['active', 'pending'] },
      tableName: 'assets',
    })

    expect(results).toHaveLength(4)
  })

  it('applies NOT IN filter', async () => {
    const results = await applyFilter({
      query: db('assets').select('*'),
      filter: { status: { nin: ['deleted'] } },
      tableName: 'assets',
    })

    expect(results).toHaveLength(4)
  })

  it('applies numeric range filter', async () => {
    const results = await applyFilter({
      query: db('assets').select('*'),
      filter: { price: { gte: 100, lte: 200 } },
      tableName: 'assets',
    })

    expect(results).toHaveLength(3)
  })

  it('applies isNull filter', async () => {
    const results = await applyFilter({
      query: db('assets').select('*'),
      filter: { deleted_at: { isNull: true } },
      tableName: 'assets',
    })

    expect(results).toHaveLength(4)
  })

  it('applies isNotNull filter', async () => {
    const results = await applyFilter({
      query: db('assets').select('*'),
      filter: { deleted_at: { isNotNull: true } },
      tableName: 'assets',
    })

    expect(results).toHaveLength(1)
  })

  it('applies multiple filters together', async () => {
    const results = await applyFilter({
      query: db('assets').select('*'),
      filter: {
        status: 'active',
        type: 'invoice',
        price: { gte: 100 },
      },
      tableName: 'assets',
    })

    expect(results).toHaveLength(2)
  })

  it('works with invoices table', async () => {
    const results = await applyFilter({
      query: db('invoices').select('*'),
      filter: {
        status: 'paid',
        deleted_at: { isNull: true },
      },
      tableName: 'invoices',
    })

    expect(results).toHaveLength(2)
  })

  it('works with invoices using snake_case foreign key', async () => {
    const results = await applyFilter({
      query: db('invoices').select('*'),
      filter: {
        customer_id: '00000000-0000-0000-0000-000000000201',
        amount: { gte: 500 },
      },
      tableName: 'invoices',
    })

    expect(results).toHaveLength(3)
  })

  it('throws when using camelCase keys (no automatic conversion)', async () => {
    await expect(
      applyFilter({
        query: db('assets').select('*'),
        filter: { deletedAt: { isNull: true } },
        tableName: 'assets',
      }),
    ).rejects.toThrow(/column .*deletedAt.* does not exist/i)
  })
})
