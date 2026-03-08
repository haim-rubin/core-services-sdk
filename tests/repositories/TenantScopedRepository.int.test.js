// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  stopPostgres,
  startPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'

import { TenantScopedRepository } from '../../src/postgresql/repositories/TenantScopedRepository.js'

const PG_OPTIONS = {
  port: 5446,
  db: 'testdb',
  user: 'testuser',
  pass: 'testpass',
  containerName: 'postgres-tenant-repo-test-5446',
}

const DATABASE_URI = buildPostgresUri(PG_OPTIONS)

const TENANT_A = '00000000-0000-0000-0000-000000000010'
const TENANT_B = '00000000-0000-0000-0000-000000000020'

let db

beforeAll(async () => {
  startPostgres(PG_OPTIONS)

  db = knex({
    client: 'pg',
    connection: DATABASE_URI,
  })

  await db.schema.createTable('customers', (table) => {
    table.uuid('id').primary()
    table.uuid('tenant_id').notNullable()
    table.string('name')
    table.timestamp('created_at').notNullable()
  })

  await db.schema.createTable('orders', (table) => {
    table.uuid('id').primary()
    table.uuid('tenant_id').notNullable()
    table.uuid('customer_id')
    table.decimal('amount', 10, 2)
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
  await db('orders').truncate()
  await db('customers').truncate()

  await db('customers').insert([
    {
      id: '00000000-0000-0000-0000-000000000001',
      tenant_id: TENANT_A,
      name: 'Alice',
      created_at: new Date('2024-01-01'),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      tenant_id: TENANT_B,
      name: 'Bob',
      created_at: new Date('2024-01-02'),
    },
  ])

  await db('orders').insert([
    {
      id: '00000000-0000-0000-0000-000000000101',
      tenant_id: TENANT_A,
      customer_id: '00000000-0000-0000-0000-000000000001',
      amount: 100,
      created_at: new Date('2024-01-10'),
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      tenant_id: TENANT_A,
      customer_id: '00000000-0000-0000-0000-000000000001',
      amount: 200,
      created_at: new Date('2024-01-11'),
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      tenant_id: TENANT_B,
      customer_id: '00000000-0000-0000-0000-000000000002',
      amount: 300,
      created_at: new Date('2024-01-12'),
    },
  ])
})

class OrdersRepository extends TenantScopedRepository {
  static tableName = 'orders'

  constructor(deps) {
    super({
      ...deps,
      baseQueryBuilder(qb) {
        qb.innerJoin('customers', 'customers.id', 'orders.customer_id')
      },
    })
  }
}

describe('TenantScopedRepository integration', () => {
  it('throws if tenantId missing', async () => {
    const repo = new OrdersRepository({ db })

    await expect(
      repo.find({
        filter: {},
      }),
    ).rejects.toThrow('tenantId is required')
  })

  it('returns only rows for tenant', async () => {
    const repo = new OrdersRepository({ db })

    const result = await repo.find({
      filter: {
        tenantId: TENANT_A,
      },
      columns: ['orders.id', 'orders.amount'],
    })

    expect(result.list.length).toBe(2)
  })

  it('works with join and columns', async () => {
    const repo = new OrdersRepository({ db })

    const result = await repo.find({
      filter: {
        tenantId: TENANT_A,
      },
      columns: ['orders.id', 'orders.amount', 'customers.name'],
    })

    const row = result.list[0]

    expect(row).toHaveProperty('amount')
    expect(row).toHaveProperty('name')
  })

  it('pagination respects tenant scope', async () => {
    const repo = new OrdersRepository({ db })

    const result = await repo.find({
      filter: {
        tenantId: TENANT_A,
      },
      limit: 1,
      page: 1,
      columns: ['orders.id'],
    })

    expect(result.list.length).toBe(1)
    expect(result.totalCount).toBe(2)
    expect(result.pages).toBe(2)
  })
})
