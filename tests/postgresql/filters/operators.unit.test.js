import { describe, it, expect, vi } from 'vitest'

import { OPERATORS } from '../../../src/postgresql/filters/operators.js'

describe('OPERATORS', () => {
  it('eq calls where with "="', () => {
    const q = { where: vi.fn(() => q) }
    OPERATORS.eq(q, 'a', 1)
    expect(q.where).toHaveBeenCalledWith('a', '=', 1)
  })

  it('in calls whereIn', () => {
    const q = { whereIn: vi.fn(() => q) }
    OPERATORS.in(q, 'a', [1, 2])
    expect(q.whereIn).toHaveBeenCalledWith('a', [1, 2])
  })

  it('isNull true calls whereNull', () => {
    const q = { whereNull: vi.fn(() => q) }
    OPERATORS.isNull(q, 'a', true)
    expect(q.whereNull).toHaveBeenCalledWith('a')
  })
})
