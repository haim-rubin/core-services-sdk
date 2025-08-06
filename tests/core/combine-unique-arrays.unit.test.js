import { describe, it, expect } from 'vitest'

import { combineUniqueArrays } from '../../src/core/combine-unique-arrays.js'

describe('combineUniqueArrays', () => {
  it('should combine arrays and remove duplicates (numbers)', () => {
    const result = combineUniqueArrays([1, 2], [2, 3], [3, 4])
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should combine arrays and remove duplicates (strings)', () => {
    const result = combineUniqueArrays(['a', 'b'], ['b', 'c'])
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('should return empty array when no input is provided', () => {
    const result = combineUniqueArrays()
    expect(result).toEqual([])
  })

  it('should handle single array', () => {
    const result = combineUniqueArrays([1, 2, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })

  it('should preserve order of first appearance', () => {
    const result = combineUniqueArrays(['b', 'a'], ['a', 'c'])
    expect(result).toEqual(['b', 'a', 'c'])
  })

  it('should handle mixed types', () => {
    const result = combineUniqueArrays(['1', 1, true, 'true'], [true, '1'])
    expect(result).toEqual(['1', 1, true, 'true'])
  })
})
