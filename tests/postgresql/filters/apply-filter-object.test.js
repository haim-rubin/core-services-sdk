import { describe, it, expect, vi } from 'vitest'
import { applyFilterObject } from '../../../src/postgresql/filters/apply-filter-object.js'
import { OPERATORS } from '../../../src/postgresql/filters/operators.js'

describe('applyFilterObject', () => {
  it('applies multiple operators', () => {
    const q = {}
    // @ts-ignore
    const spy = vi.spyOn(OPERATORS, 'gte').mockReturnValue(q)

    // @ts-ignore
    applyFilterObject(q, 'price', { gte: 100 })

    expect(spy).toHaveBeenCalledWith(q, 'price', 100)
  })

  it('ignores unknown operators', () => {
    const q = {}
    // @ts-ignore
    const result = applyFilterObject(q, 'x', { unknown: 1 })
    expect(result).toBe(q)
  })
})
