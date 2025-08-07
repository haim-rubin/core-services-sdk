// @ts-nocheck
import { describe, it, expect } from 'vitest'

import { HTTP_METHODS } from '../../src/http/http-method.js'

describe('HTTP_METHODS constant', () => {
  it('should include all standard HTTP methods', () => {
    expect(HTTP_METHODS).toEqual({
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      PATCH: 'PATCH',
      DELETE: 'DELETE',
    })
  })

  it('should be frozen (immutable)', () => {
    expect(Object.isFrozen(HTTP_METHODS)).toBe(true)

    // Attempt to mutate and verify it fails
    try {
      HTTP_METHODS.NEW = 'NEW'
    } catch (err) {
      // Ignore in strict mode
    }

    expect(HTTP_METHODS).not.toHaveProperty('NEW')
  })
})
