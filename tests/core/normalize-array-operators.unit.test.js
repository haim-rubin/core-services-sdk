import { describe, it, expect } from 'vitest'

import { normalizeOperators } from '../../src/core/normalize-array-operators.js'

describe('normalizeOperators', () => {
  it('should wrap single value in `in` into an array', () => {
    const input = { userId: { in: '123' } }
    const output = normalizeOperators(input)
    expect(output).toEqual({ userId: { in: ['123'] } })
  })

  it('should keep array value in `in` as is', () => {
    const input = { userId: { in: ['123', '456'] } }
    const output = normalizeOperators(input)
    expect(output).toEqual({ userId: { in: ['123', '456'] } })
  })

  it('should wrap single value in `nin` into an array', () => {
    const input = { userId: { nin: '789' } }
    const output = normalizeOperators(input)
    expect(output).toEqual({ userId: { nin: ['789'] } })
  })

  it('should normalize object with numeric keys into array (or)', () => {
    const input = {
      or: { 0: { status: { eq: 'active' } }, 1: { role: { eq: 'admin' } } },
    }
    const output = normalizeOperators(input)
    expect(output).toEqual({
      or: [{ status: { eq: 'active' } }, { role: { eq: 'admin' } }],
    })
  })

  it('should wrap single object in `or` into array', () => {
    const input = { or: { status: { eq: 'active' } } }
    const output = normalizeOperators(input)
    expect(output).toEqual({
      or: [{ status: { eq: 'active' } }],
    })
  })

  it('should handle nested in + or together', () => {
    const input = {
      or: {
        0: { userId: { in: '123' } },
        1: { userId: { in: ['456', '789'] } },
      },
    }
    const output = normalizeOperators(input)
    expect(output).toEqual({
      or: [{ userId: { in: ['123'] } }, { userId: { in: ['456', '789'] } }],
    })
  })

  it('should handle `and` with mixed single and multiple values', () => {
    const input = {
      and: {
        0: { status: { eq: 'active' } },
        1: { userId: { in: '123' } },
      },
    }
    const output = normalizeOperators(input)
    expect(output).toEqual({
      and: [{ status: { eq: 'active' } }, { userId: { in: ['123'] } }],
    })
  })

  it('should do nothing for fields without array operators', () => {
    const input = { age: { gte: 18 } }
    const output = normalizeOperators(input)
    expect(output).toEqual({ age: { gte: 18 } })
  })

  it('should work with deeply nested structures', () => {
    const input = {
      or: {
        0: {
          and: {
            0: { userId: { in: '123' } },
            1: { status: { eq: 'active' } },
          },
        },
        1: { role: { nin: 'guest' } },
      },
    }

    const output = normalizeOperators(input)

    expect(output).toEqual({
      or: [
        {
          and: [{ userId: { in: ['123'] } }, { status: { eq: 'active' } }],
        },
        { role: { nin: ['guest'] } },
      ],
    })
  })
})
