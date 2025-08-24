import { describe, it, expect } from 'vitest'

import { mask, maskSingle } from '../../src/util/index.js'

describe('maskSingle', () => {
  it('masks middle of a regular string (length == left+right)', () => {
    expect(maskSingle('abcdefgh')).toBe('a•••h')
  })

  it('masks numbers with default settings', () => {
    expect(maskSingle(12345678)).toBe('1•••8')
  })

  it('masks booleans', () => {
    expect(maskSingle(true)).toBe('t•••e')
    expect(maskSingle(false)).toBe('f•••e')
  })

  it('masks very short strings correctly', () => {
    expect(maskSingle('ab')).toBe('a••b'.slice(0, 3)) // will produce 'a••'
    expect(maskSingle('a')).toBe('•')
    expect(maskSingle('')).toBe('')
  })

  it('respects custom fill and mask length', () => {
    expect(maskSingle('abcdefgh', '*', 5)).toBe('a*****h')
  })

  it('ensures maskLen is at least 1', () => {
    expect(maskSingle('abcdefgh', '*', 0)).toBe('a*h')
  })

  it('returns empty string for null/undefined', () => {
    expect(maskSingle(null)).toBe('')
    expect(maskSingle(undefined)).toBe('')
  })
})

describe('mask', () => {
  it('masks primitives (string, number, boolean)', () => {
    expect(mask('abcdefgh')).toBe('a•••h')
    expect(mask(12345678)).toBe('1•••8')
    expect(mask(true)).toBe('true')
    expect(mask(false)).toBe('false')
  })

  it('returns empty string for null/undefined', () => {
    expect(mask(null)).toBe('')
    expect(mask(undefined)).toBe('')
  })

  it('masks arrays recursively', () => {
    expect(mask(['abcdefgh', 12345678])).toEqual(['a•••h', '1•••8'])
  })

  it('masks objects recursively', () => {
    expect(mask({ a: 'abcdefgh', b: 12345678 })).toEqual({
      a: 'a•••h',
      b: '1•••8',
    })
  })

  it('masks nested objects/arrays recursively', () => {
    const input = { arr: ['abcdefgh', { num: 12345678 }] }
    const expected = { arr: ['a•••h', { num: '1•••8' }] }
    expect(mask(input)).toEqual(expected)
  })

  it('handles Date instances by returning full ISO string', () => {
    const d = new Date('2025-08-15T12:34:56.789Z')
    expect(mask(d)).toBe(d.toISOString())
  })

  it('respects custom fill and mask length in recursive calls', () => {
    const input = { val: 'abcdefgh' }
    const expected = { val: 'a*****h' }
    expect(mask(input, '*', 5)).toEqual(expected)
  })
})
