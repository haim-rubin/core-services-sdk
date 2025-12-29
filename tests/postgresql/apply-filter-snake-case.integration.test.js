// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  stopPostgres,
  startPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'

import { applyFilterSnakeCase } from '../../src/postgresql/filters/apply-filter-snake-case.js'

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

describe('applyFilterSnakeCase integration', () => {
  it('applies equality filter', async () => {
    const query = db('assets').select('*')

    applyFilterSnakeCase({
      query,
      filter: { status: 'active' },
    })

    const results = await query
    expect(results).toHaveLength(3)
  })

  it('converts camelCase keys to snake_case', async () => {
    const query = db('assets').select('*')

    applyFilterSnakeCase({
      query,
      filter: { deletedAt: { isNull: true }, name: 'Asset One' },
    })

    const results = await query
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Asset One')
  })

  it('ignores unknown operators', async () => {
    const query = db('assets').select('*')

    applyFilterSnakeCase({
      query,
      filter: { status: { unknown: 'x' } },
    })

    const results = await query
    expect(results).toHaveLength(5)
  })

  it('works with invoices table and camelCase conversion', async () => {
    const query = db('invoices').select('*')

    applyFilterSnakeCase({
      query,
      filter: {
        customerId: '00000000-0000-0000-0000-000000000201',
        amount: { gte: 500 },
      },
    })

    const results = await query
    expect(results).toHaveLength(3)
  })
})
