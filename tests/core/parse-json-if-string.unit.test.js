import { describe, it, expect } from 'vitest'

import { parseJsonIfString } from '../../src/core/parse-json-if-string.js'

describe('parseJsonIfString', () => {
  it('parses a valid JSON string', () => {
    const value = '{"a":1,"b":"test"}'

    const result = parseJsonIfString(value)

    expect(result).toEqual({ a: 1, b: 'test' })
  })

  it('returns an object as-is', () => {
    const value = { a: 1, b: 'test' }

    const result = parseJsonIfString(value)

    expect(result).toBe(value)
  })

  it('returns an array as-is', () => {
    const value = [1, 2, 3]

    const result = parseJsonIfString(value)

    expect(result).toBe(value)
  })

  it('returns null as-is', () => {
    const value = null

    const result = parseJsonIfString(value)

    expect(result).toBeNull()
  })

  it('returns a number as-is', () => {
    const value = 42

    const result = parseJsonIfString(value)

    expect(result).toBe(42)
  })

  it('throws when JSON string is invalid', () => {
    const value = '{"a":1,'

    expect(() => parseJsonIfString(value)).toThrow(SyntaxError)
  })
})
