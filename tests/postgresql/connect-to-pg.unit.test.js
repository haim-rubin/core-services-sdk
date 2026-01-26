// @ts-nocheck
import { describe, it, expect, afterEach } from 'vitest'
import { connectToPg } from '../../src/postgresql/connect-to-pg.js'

let db

afterEach(async () => {
  if (db) {
    await db.destroy()
    db = null
  }
})

describe('connectToPg', () => {
  it('creates knex instance with default pool settings', () => {
    db = connectToPg('postgres://user:pass@localhost:5432/test')

    const pool = db.client.pool

    expect(pool).toBeDefined()
    expect(pool.min).toBe(2)
    expect(pool.max).toBe(10)
    expect(pool.acquireTimeoutMillis).toBeGreaterThan(0)
    expect(pool.idleTimeoutMillis).toBe(10000)
  })

  it('allows overriding pool settings', () => {
    db = connectToPg('postgres://user:pass@localhost:5432/test', {
      pool: {
        min: 1,
        max: 20,
      },
    })

    const pool = db.client.pool

    expect(pool.min).toBe(1)
    expect(pool.max).toBe(20)
    expect(pool.acquireTimeoutMillis).toBeGreaterThan(0)
  })

  it('allows overriding non-pool knex options', () => {
    db = connectToPg('postgres://user:pass@localhost:5432/test', {
      debug: true,
    })

    expect(db.client.config.debug).toBe(true)
  })

  it('does not lose default pool values when partial override is provided', () => {
    db = connectToPg('postgres://user:pass@localhost:5432/test', {
      pool: {
        max: 15,
      },
    })

    const pool = db.client.pool

    expect(pool.min).toBe(2)
    expect(pool.max).toBe(15)
    expect(pool.acquireTimeoutMillis).toBeGreaterThan(0)
  })

  it('returns a valid knex instance', () => {
    db = connectToPg('postgres://user:pass@localhost:5432/test')

    expect(typeof db.raw).toBe('function')
    expect(typeof db.destroy).toBe('function')
  })
})
