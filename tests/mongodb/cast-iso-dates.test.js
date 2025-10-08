import { describe, it, expect } from 'vitest'

import { castIsoDates } from '../../src/mongodb/dsl-to-mongo.js'

describe('castIsoDates', () => {
  it('should convert ISO date strings to Date objects', () => {
    const input = {
      createdAt: {
        $gte: '2025-10-08T00:00:00.000Z',
        $lte: '2025-10-09T23:59:59.999Z',
      },
    }

    const output = castIsoDates(structuredClone(input))

    expect(output.createdAt.$gte).toBeInstanceOf(Date)
    expect(output.createdAt.$lte).toBeInstanceOf(Date)
    expect(output.createdAt.$gte.toISOString()).toBe('2025-10-08T00:00:00.000Z')
    expect(output.createdAt.$lte.toISOString()).toBe('2025-10-09T23:59:59.999Z')
  })

  it('should recursively convert nested ISO strings', () => {
    const input = {
      filters: [
        { time: '2025-09-01T12:00:00.000Z' },
        { inner: { deep: '2025-09-02T00:00:00.000Z' } },
      ],
    }

    const output = castIsoDates(structuredClone(input))

    expect(output.filters[0].time).toBeInstanceOf(Date)
    expect(output.filters[1].inner.deep).toBeInstanceOf(Date)
  })

  it('should not modify non-date strings or numbers', () => {
    const input = {
      name: 'hello',
      value: 123,
      notIso: '2025-09-01', // missing 'T' — not ISO format
    }

    const output = castIsoDates(structuredClone(input))

    expect(output.name).toBe('hello')
    expect(output.value).toBe(123)
    expect(output.notIso).toBe('2025-09-01')
  })

  it('should handle arrays directly', () => {
    const input = ['2025-10-01T10:00:00.000Z', 'not-a-date', 5]

    const output = castIsoDates(structuredClone(input))

    expect(output[0]).toBeInstanceOf(Date)
    expect(output[1]).toBe('not-a-date')
    expect(output[2]).toBe(5)
  })

  it('should leave null and undefined unchanged', () => {
    const input = { a: null, b: undefined }
    const output = castIsoDates(structuredClone(input))

    expect(output.a).toBeNull()
    expect(output.b).toBeUndefined()
  })
})
