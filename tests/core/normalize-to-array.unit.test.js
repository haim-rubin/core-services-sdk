import { describe, it, expect } from 'vitest'

import { normalizeToArray } from '../../src/core/normalize-to-array.js'

describe('normalizeToArray', () => {
  it('should return an empty array for undefined', () => {
    expect(normalizeToArray(undefined)).toEqual([])
  })

  it('should return an empty array for null', () => {
    expect(normalizeToArray(null)).toEqual([])
  })

  it('should split a comma-separated string and trim each value', () => {
    expect(normalizeToArray('a,b, c , ,d')).toEqual(['a', 'b', 'c', 'd'])
  })

  it('should handle string with extra commas and spaces', () => {
    expect(normalizeToArray(' , a , ,b,, ,c ,')).toEqual(['a', 'b', 'c'])
  })

  it('should trim and filter empty values from an array of strings', () => {
    expect(normalizeToArray([' a ', 'b', '', '   ', 'c'])).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('should convert non-string/non-array values to string and split by comma', () => {
    expect(normalizeToArray(123)).toEqual(['123'])
    expect(normalizeToArray(true)).toEqual(['true'])
    expect(normalizeToArray({})).toEqual(['[object Object]'])
  })

  it('should handle an array of non-string values', () => {
    expect(normalizeToArray([1, ' 2 ', null, undefined, true])).toEqual(['2'])
  })

  it('should preserve order of values after normalization', () => {
    expect(normalizeToArray(['  b ', 'a', ' c '])).toEqual(['b', 'a', 'c'])
  })
})
