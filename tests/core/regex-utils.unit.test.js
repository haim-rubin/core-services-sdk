// @ts-nocheck
import { describe, it, expect } from 'vitest'

import { isValidRegex } from '../../src/core/regex-utils.js'

describe('isValidRegex', () => {
  it('returns true for valid regex strings', () => {
    expect(isValidRegex('^[a-z]+$')).toBe(true)
    expect(isValidRegex('\\d{3}-\\d{2}-\\d{4}')).toBe(true)
    expect(isValidRegex('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')).toBe(true)
    expect(isValidRegex('.*')).toBe(true)
    expect(isValidRegex('^$')).toBe(true)
  })

  it('returns true for RegExp objects', () => {
    expect(isValidRegex(/^[a-z]+$/)).toBe(true)
    expect(isValidRegex(/\d{3}/)).toBe(true)
    expect(isValidRegex(/abc/i)).toBe(true)
  })

  it('returns false for invalid regex strings', () => {
    expect(isValidRegex('[')).toBe(false)
    expect(isValidRegex('(')).toBe(false)
    expect(isValidRegex('\\')).toBe(false)
    expect(isValidRegex('[a-z')).toBe(false)
    expect(isValidRegex('(abc')).toBe(false)
  })

  it('returns false for invalid types', () => {
    expect(isValidRegex(undefined)).toBe(false)
    expect(isValidRegex(null)).toBe(false)
    expect(isValidRegex(123)).toBe(false)
    expect(isValidRegex({})).toBe(false)
    expect(isValidRegex([])).toBe(false)
    expect(isValidRegex(true)).toBe(false)
  })

  it('returns true for an empty string (valid regex)', () => {
    expect(isValidRegex('')).toBe(true) // equivalent to: new RegExp('')
  })
})
