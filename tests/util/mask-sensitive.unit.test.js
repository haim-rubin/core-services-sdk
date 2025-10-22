import { describe, it, expect } from 'vitest'

import { mask, maskSingle } from '../../src/util/index.js'

describe('maskSingle', () => {
  it('masks middle of a regular string (length == left+right)', () => {
    const value = maskSingle('abcdefgh')
    expect(value).toBe('ab....gh')
  })

  it('masks numbers with default settings', () => {
    expect(maskSingle(12345678)).toBe('12....78')
  })

  it('masks booleans', () => {
    const trueValue = maskSingle(true)
    expect(trueValue).toBe('true')
    const falseValue = maskSingle(false)
    expect(falseValue).toBe('false')
  })

  it('masks very short strings correctly', () => {
    const value1 = maskSingle('ab')
    expect(value1).toBe('a.') // will produce 'a.'
    const value2 = maskSingle('a')
    expect(value2).toBe('.')
    expect(maskSingle('')).toBe('')
  })

  it('respects custom fill and mask length', () => {
    const value = maskSingle('abcdefgh', '*', 5)
    expect(value).toBe('ab*****gh')
  })

  it('ensures maskLen is at least 1', () => {
    const value = maskSingle('abcdefgh', '*', 1, 1, 1)
    expect(value).toBe('a*h')
  })

  it('returns empty string for null/undefined', () => {
    expect(maskSingle(null)).toBe('')
    expect(maskSingle(undefined)).toBe('')
  })
})

describe('mask', () => {
  it('masks primitives (string, number, boolean)', () => {
    expect(mask('abcdefgh')).toBe('ab....gh')
    expect(mask(12345678)).toBe('12....78')
    const trueValue = mask(true)
    expect(trueValue).toBe('true')
    expect(mask(false)).toBe('false')
  })

  it('returns empty string for null/undefined', () => {
    expect(mask(null)).toBe('')
    expect(mask(undefined)).toBe('')
  })

  it('masks arrays recursively', () => {
    const value = mask(['abcdefgh', 12345678])
    expect(value).toEqual(['ab....gh', '12....78'])
  })

  it('masks objects recursively', () => {
    expect(mask({ a: 'abcdefgh', b: 12345678 })).toEqual({
      a: 'ab....gh',
      b: '12....78',
    })
  })

  it('masks nested objects/arrays recursively', () => {
    const input = { arr: ['abcdefgh', { num: 12345678 }] }
    const expected = { arr: ['ab....gh', { num: '12....78' }] }
    const value = mask(input)
    expect(value).toEqual(expected)
  })

  it('handles Date instances by returning full ISO string', () => {
    const d = new Date('2025-08-15T12:34:56.789Z')
    expect(mask(d)).toBe(d.toISOString())
  })

  it('respects custom fill and mask length in recursive calls', () => {
    const input = { val: 'abcdefgh' }
    const expected = { val: 'ab*****gh' }
    const value = mask(input, '*', 5)
    expect(value).toEqual(expected)
  })

  it('mask long string with maskLen in recursive calls', () => {
    const input = {
      val: 'abcdsdkljhfjksdhgfjksdghkhsdkjfhasldkjjhskjfgsdkjhgfhskdgfefgh',
    }
    const expected = { val: 'ab***gh' }
    const value = mask(input, '*', 3)
    expect(value).toEqual(expected)
  })
})
