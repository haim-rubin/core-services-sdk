import { describe, it, expect } from 'vitest'

import { toMongo } from '../../src/mongodb/dsl-to-mongo.js'

describe('toMongo - extended operators', () => {
  it('should support all comparison operators', () => {
    const input = {
      age: { eq: 30, ne: 40, gt: 10, gte: 20, lt: 100, lte: 90 },
      userId: { in: ['u1', 'u2'], nin: ['u3'] },
    }
    const output = toMongo(input)

    expect(output).toEqual({
      age: { $eq: 30, $ne: 40, $gt: 10, $gte: 20, $lt: 100, $lte: 90 },
      userId: { $in: ['u1', 'u2'], $nin: ['u3'] },
    })
  })

  it('should support logical operators', () => {
    const input = {
      and: [{ age: { gt: 18 } }, { status: { eq: 'active' } }],
      or: [{ role: { eq: 'admin' } }, { role: { eq: 'user' } }],
      nor: [{ country: { eq: 'US' } }],
    }
    const output = toMongo(input)

    expect(output).toEqual({
      $and: [{ age: { $gt: 18 } }, { status: { $eq: 'active' } }],
      $or: [{ role: { $eq: 'admin' } }, { role: { $eq: 'user' } }],
      $nor: [{ country: { $eq: 'US' } }],
    })
  })

  it('should support element operators', () => {
    const input = {
      deletedAt: { exists: false },
      status: { type: 'string' },
    }
    const output = toMongo(input)

    expect(output).toEqual({
      deletedAt: { $exists: false },
      status: { $type: 'string' },
    })
  })

  it('should support evaluation operators', () => {
    const input = {
      name: { regex: '^haim', options: 'i' },
      score: { mod: [4, 0] },
      description: { text: 'fast search' },
    }
    const output = toMongo(input)

    expect(output).toEqual({
      name: { $regex: '^haim', $options: 'i' },
      score: { $mod: [4, 0] },
      description: { $text: 'fast search' },
    })
  })

  it('should support array operators', () => {
    const input = {
      tags: { all: ['tech', 'ai'], size: 3 },
      scores: { elemMatch: { gt: 90 } },
    }
    const output = toMongo(input)

    expect(output).toEqual({
      tags: { $all: ['tech', 'ai'], $size: 3 },
      scores: { $elemMatch: { $gt: 90 } },
    })
  })

  it('should not transform unknown operators (false positive check)', () => {
    const input = {
      age: { weirdOp: 123 },
    }
    const output = toMongo(input)

    expect(output).toEqual({
      age: { $weirdOp: 123 },
    })
  })

  it('should not wrap already Mongo operators with $$ (false positive)', () => {
    const input = {
      age: { $gte: 18 },
    }
    const output = toMongo(input)

    expect(output).toEqual({
      age: { $gte: 18 },
    })
  })

  it('should handle nested structures with mix of operators', () => {
    const input = {
      or: [
        { and: [{ age: { gte: 18 } }, { age: { lte: 65 } }] },
        { status: { ne: 'banned' } },
      ],
      tags: { all: ['mongo', 'node'] },
    }
    const output = toMongo(input)

    expect(output).toEqual({
      $or: [
        { $and: [{ age: { $gte: 18 } }, { age: { $lte: 65 } }] },
        { status: { $ne: 'banned' } },
      ],
      tags: { $all: ['mongo', 'node'] },
    })
  })
})
