import { describe, it, expect } from 'vitest'

import { toMongo } from '../../src/mongodb/dsl-to-mongo.js'

describe('toMongo', () => {
  it('should convert plain values to $eq', () => {
    const input = { status: 'active', role: 'admin' }
    const output = toMongo(input)
    expect(output).toEqual({
      status: { $eq: 'active' },
      role: { $eq: 'admin' },
    })
  })

  it('should convert eq operator to $eq', () => {
    const input = { status: { eq: 'active' } }
    const output = toMongo(input)
    expect(output).toEqual({ status: { $eq: 'active' } })
  })

  it('should convert in operator to $in', () => {
    const input = { userId: { in: ['123', '456'] } }
    const output = toMongo(input)
    expect(output).toEqual({ userId: { $in: ['123', '456'] } })
  })

  it('should convert nin operator to $nin', () => {
    const input = { userId: { nin: ['123'] } }
    const output = toMongo(input)
    expect(output).toEqual({ userId: { $nin: ['123'] } })
  })

  it('should convert comparison operators correctly', () => {
    const input = {
      age: { gt: 18, lte: 65 },
    }
    const output = toMongo(input)
    expect(output).toEqual({
      age: { $gt: 18, $lte: 65 },
    })
  })

  it('should handle $or with multiple conditions', () => {
    const input = {
      or: [{ status: { eq: 'active' } }, { role: { eq: 'admin' } }],
    }
    const output = toMongo(input)
    expect(output).toEqual({
      $or: [{ status: { $eq: 'active' } }, { role: { $eq: 'admin' } }],
    })
  })

  it('should handle $and with multiple conditions', () => {
    const input = {
      and: [{ status: { eq: 'active' } }, { age: { gte: 18 } }],
    }
    const output = toMongo(input)
    expect(output).toEqual({
      $and: [{ status: { $eq: 'active' } }, { age: { $gte: 18 } }],
    })
  })

  it('should handle nested logical operators', () => {
    const input = {
      or: [
        { status: { eq: 'active' } },
        {
          and: [{ age: { gte: 18 } }, { age: { lte: 65 } }],
        },
      ],
    }
    const output = toMongo(input)
    expect(output).toEqual({
      $or: [
        { status: { $eq: 'active' } },
        {
          $and: [{ age: { $gte: 18 } }, { age: { $lte: 65 } }],
        },
      ],
    })
  })

  it('should handle multiple fields mixed with operators', () => {
    const input = {
      userId: { in: ['123', '456'] },
      status: 'active',
      or: [{ role: { eq: 'admin' } }, { age: { gt: 30 } }],
    }
    const output = toMongo(input)
    expect(output).toEqual({
      userId: { $in: ['123', '456'] },
      status: { $eq: 'active' },
      $or: [{ role: { $eq: 'admin' } }, { age: { $gt: 30 } }],
    })
  })

  it('should return empty object if input is empty', () => {
    expect(toMongo({})).toEqual({})
  })

  it('should handle null values as $eq null', () => {
    const input = { deletedAt: null }
    const output = toMongo(input)
    expect(output).toEqual({ deletedAt: { $eq: null } })
  })
})
