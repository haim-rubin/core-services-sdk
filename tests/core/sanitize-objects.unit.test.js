import { describe, it, expect } from 'vitest'

import {
  sanitizeObject,
  sanitizeUndefinedFields,
  sanitizeObjectAllowProps,
  sanitizeObjectDisallowProps,
} from '../../src/core/sanitize-objects.js'

describe('sanitizeObject', () => {
  it('filters object based on provided filter function', () => {
    const result = sanitizeObject({ a: 1, b: 2, c: 3 }, ([key]) => key !== 'b')
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('returns empty object when no entries pass the filter', () => {
    const result = sanitizeObject({ a: 1 }, () => false)
    expect(result).toEqual({})
  })

  it('returns full object when all entries pass the filter', () => {
    const input = { a: 1, b: 2 }
    const result = sanitizeObject(input, () => true)
    expect(result).toEqual(input)
  })
})

describe('sanitizeUndefinedFields', () => {
  it('removes properties with undefined values', () => {
    const result = sanitizeUndefinedFields({ a: 1, b: undefined, c: null })
    expect(result).toEqual({ a: 1, c: null })
  })

  it('returns empty object if all values are undefined', () => {
    const result = sanitizeUndefinedFields({ a: undefined, b: undefined })
    expect(result).toEqual({})
  })

  it('does not remove null or falsy (but defined) values', () => {
    const result = sanitizeUndefinedFields({ a: null, b: 0, c: false, d: '' })
    expect(result).toEqual({ a: null, b: 0, c: false, d: '' })
  })
})

describe('sanitizeObjectAllowProps', () => {
  it('keeps only allowed fields', () => {
    const result = sanitizeObjectAllowProps({ a: 1, b: 2, c: 3 }, ['a', 'c'])
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('returns empty object if allowedFields is empty', () => {
    const result = sanitizeObjectAllowProps({ a: 1, b: 2 }, [])
    expect(result).toEqual({})
  })

  it('ignores fields not present in the object', () => {
    const result = sanitizeObjectAllowProps({ a: 1 }, ['a', 'b', 'c'])
    expect(result).toEqual({ a: 1 })
  })
})

describe('sanitizeObjectDisallowProps', () => {
  it('removes disallowed fields from object', () => {
    const result = sanitizeObjectDisallowProps({ a: 1, b: 2, c: 3 }, ['b'])
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('returns full object if disallowedFields is empty', () => {
    const input = { a: 1, b: 2 }
    const result = sanitizeObjectDisallowProps(input, [])
    expect(result).toEqual(input)
  })

  it('removes all properties if all are disallowed', () => {
    const result = sanitizeObjectDisallowProps({ a: 1, b: 2 }, ['a', 'b'])
    expect(result).toEqual({})
  })
})
