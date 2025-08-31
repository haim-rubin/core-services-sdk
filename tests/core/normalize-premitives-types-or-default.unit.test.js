import { describe, it, expect } from 'vitest'

import {
  normalizeOrDefault,
  normalizeStringOrDefault,
  normalizeNumberOrDefault,
  normalizeBooleanOrDefault,
} from '../../src/core/normalize-premitives-types-or-default.js'

describe('normalizeOrDefault (generic)', () => {
  it('returns value if predicate is true', () => {
    const out = normalizeOrDefault(5, (v) => typeof v === 'number', 0)
    expect(out).toBe(5)
  })
  it('returns default if predicate is false', () => {
    const out = normalizeOrDefault('x', (v) => typeof v === 'number', 0)
    expect(out).toBe(0)
  })
})

describe('normalizeStringOrDefault (strict, no coercion)', () => {
  it('keeps a non-empty trimmed string', () => {
    expect(normalizeStringOrDefault('  hello  ', 'fallback')).toBe('hello')
  })
  it('returns default for empty / whitespace-only', () => {
    expect(normalizeStringOrDefault('', 'fallback')).toBe('fallback')
    expect(normalizeStringOrDefault('   ', 'fallback')).toBe('fallback')
  })
  it('returns default for non-strings', () => {
    expect(normalizeStringOrDefault(123, 'fallback')).toBe('fallback')
    expect(normalizeStringOrDefault(null, 'fallback')).toBe('fallback')
  })
  it('trims default defensively', () => {
    expect(normalizeStringOrDefault('', '  fallback  ')).toBe('fallback')
  })
})

describe('normalizeNumberOrDefault (coercive for strings)', () => {
  it('keeps valid number', () => {
    expect(normalizeNumberOrDefault(42, 0)).toBe(42)
  })
  it('coerces valid numeric string', () => {
    expect(normalizeNumberOrDefault('42', 0)).toBe(42)
    expect(normalizeNumberOrDefault('  3.14 ', 0)).toBe(3.14)
    expect(normalizeNumberOrDefault('1e3', 0)).toBe(1000)
    expect(normalizeNumberOrDefault('-7', 0)).toBe(-7)
  })
  it('returns default for invalid number inputs', () => {
    expect(normalizeNumberOrDefault(NaN, 7)).toBe(7)
    expect(normalizeNumberOrDefault('   ', 7)).toBe(7)
    expect(normalizeNumberOrDefault('abc', 7)).toBe(7)
    expect(normalizeNumberOrDefault({}, 7)).toBe(7)
  })
})

describe('normalizeBooleanOrDefault (coercive for "true"/"false" strings)', () => {
  it('keeps actual booleans', () => {
    expect(normalizeBooleanOrDefault(true, false)).toBe(true)
    expect(normalizeBooleanOrDefault(false, true)).toBe(false)
  })
  it('coerces "true"/"false" strings (case-insensitive)', () => {
    expect(normalizeBooleanOrDefault('true', false)).toBe(true)
    expect(normalizeBooleanOrDefault('FALSE', true)).toBe(false)
    expect(normalizeBooleanOrDefault('  TrUe  ', false)).toBe(true)
  })
  it('returns default for other strings / types', () => {
    expect(normalizeBooleanOrDefault('yes', false)).toBe(false)
    expect(normalizeBooleanOrDefault('0', true)).toBe(true)
    expect(normalizeBooleanOrDefault(1, false)).toBe(false)
    expect(normalizeBooleanOrDefault(null, true)).toBe(true)
  })
})
