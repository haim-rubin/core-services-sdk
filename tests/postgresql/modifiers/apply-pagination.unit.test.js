import { describe, it, expect, vi } from 'vitest'

import { applyPagination } from '../../../src/postgresql/modifiers/apply-pagination.js'

describe('applyPagination', () => {
  it('applies limit and offset', () => {
    const q = {
      limit: vi.fn(() => q),
      offset: vi.fn(() => q),
    }

    // @ts-ignore
    applyPagination({ query: q, page: 2, limit: 10 })

    expect(q.limit).toHaveBeenCalledWith(10)
    expect(q.offset).toHaveBeenCalledWith(10)
  })
})
