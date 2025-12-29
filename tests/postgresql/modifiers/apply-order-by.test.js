// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { applyOrderBy } from '../../../src/postgresql/modifiers/apply-order-by.js'

describe('applyOrderBy', () => {
  it('does nothing when orderBy is not provided', () => {
    const query = {}

    // @ts-ignore
    const result = applyOrderBy({ query })

    expect(result).toBe(query)
  })

  it('does nothing when orderBy.column is missing', () => {
    const query = {}

    const result = applyOrderBy({
      query,
      orderBy: {},
    })

    expect(result).toBe(query)
  })

  it('applies ORDER BY with default direction asc', () => {
    const query = {
      orderBy: vi.fn(() => query),
      _single: { table: 'assets' },
    }

    applyOrderBy({
      query,
      orderBy: { column: 'created_at' },
    })

    expect(query.orderBy).toHaveBeenCalledWith('assets.created_at', 'asc')
  })

  it('applies ORDER BY with explicit direction', () => {
    const query = {
      orderBy: vi.fn(() => query),
      _single: { table: 'assets' },
    }

    applyOrderBy({
      query,
      orderBy: { column: 'created_at', direction: 'desc' },
    })

    expect(query.orderBy).toHaveBeenCalledWith('assets.created_at', 'desc')
  })

  it('uses unqualified column when table name cannot be resolved', () => {
    const query = {
      orderBy: vi.fn(() => query),
    }

    applyOrderBy({
      query,
      orderBy: { column: 'created_at' },
    })

    expect(query.orderBy).toHaveBeenCalledWith('created_at', 'asc')
  })

  it('returns the same query instance for chaining', () => {
    const query = {
      orderBy: vi.fn(() => query),
      _single: { table: 'assets' },
    }

    const result = applyOrderBy({
      query,
      orderBy: { column: 'id' },
    })

    expect(result).toBe(query)
  })
})
