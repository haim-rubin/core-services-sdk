// @ts-nocheck
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import knex from 'knex'

import {
  stopPostgres,
  startPostgres,
  buildPostgresUri,
} from '../../src/postgresql/start-stop-postgres-docker.js'

import { BaseRepository } from '../../src/postgresql/repositories/BaseRepository.js'

const PG_OPTIONS = {
  port: 5449,
  db: 'testdb',
  user: 'testuser',
  pass: 'testpass',
  containerName: 'postgres-base-repo-test-5449',
}

const DATABASE_URI = buildPostgresUri(PG_OPTIONS)

let db

beforeAll(async () => {
  startPostgres(PG_OPTIONS)

  db = knex({
    client: 'pg',
    connection: DATABASE_URI,
  })

  await db.schema.createTable('customers', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.timestamp('created_at').notNullable()
  })

  await db.schema.createTable('orders', (table) => {
    table.uuid('id').primary()
    table.uuid('customer_id').notNullable()
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
      name: 'Alice',
      created_at: new Date('2024-01-01'),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Bob',
      created_at: new Date('2024-01-02'),
    },
  ])

  await db('orders').insert([
    {
      id: '00000000-0000-0000-0000-000000000101',
      customer_id: '00000000-0000-0000-0000-000000000001',
      amount: 100,
      created_at: new Date('2024-01-10'),
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      customer_id: '00000000-0000-0000-0000-000000000001',
      amount: 200,
      created_at: new Date('2024-01-11'),
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      customer_id: '00000000-0000-0000-0000-000000000002',
      amount: 300,
      created_at: new Date('2024-01-12'),
    },
  ])
})

class OrdersRepository extends BaseRepository {
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

describe('BaseRepository integration', () => {
  it('baseQueryBuilder applies JOIN correctly', async () => {
    const repo = new OrdersRepository({ db })

    const qb = repo.baseQuery()

    const rows = await qb.select('orders.id', 'customers.name')

    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveProperty('name')
  })

  it('find returns joined data using columns', async () => {
    const repo = new OrdersRepository({ db })

    const result = await repo.find({
      columns: ['orders.id', 'orders.amount', 'customers.name'],
      limit: 10,
    })

    expect(result.list.length).toBe(3)

    const row = result.list[0]

    expect(row).toHaveProperty('amount')
    expect(row).toHaveProperty('name')
  })

  it('pagination works with joins', async () => {
    const repo = new OrdersRepository({ db })

    const result = await repo.find({
      columns: ['orders.id', 'customers.name'],
      limit: 2,
      page: 1,
    })

    expect(result.list.length).toBe(2)
    expect(result.totalCount).toBe(3)
    expect(result.pages).toBe(2)
  })

  it('constructor default columns are used', async () => {
    class RepoWithColumns extends BaseRepository {
      static tableName = 'orders'

      constructor(deps) {
        super({
          ...deps,
          columns: ['orders.id'],
          baseQueryBuilder(qb) {
            qb.innerJoin('customers', 'customers.id', 'orders.customer_id')
          },
        })
      }
    }

    const repo = new RepoWithColumns({ db })

    const result = await repo.find({})

    const row = result.list[0]

    expect(Object.keys(row)).toEqual(['id'])
  })
})
