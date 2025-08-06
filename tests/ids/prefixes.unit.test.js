// @ts-nocheck
import { describe, it, expect } from 'vitest'

import { ID_PREFIXES } from '../../src/ids/prefixes.js'

describe('ID_PREFIXES', () => {
  it('contains expected keys and values', () => {
    expect(ID_PREFIXES).toEqual({
      USER: 'usr',
      TENANT: 'tnt',
      PERMISSION: 'prm',
      CORRELATION: 'crln',
      VERIFICATION: 'vrf',
      ROLE_PERMISSIONS: 'role',
    })
  })

  it('has string values for all keys', () => {
    Object.values(ID_PREFIXES).forEach((value) => {
      expect(typeof value).toBe('string')
    })
  })

  it('has unique values', () => {
    const values = Object.values(ID_PREFIXES)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(ID_PREFIXES)).toBe(true)

    // Try to mutate
    try {
      ID_PREFIXES.USER = 'hacked'
    } catch (_) {
      // Ignore error in strict mode
    }

    expect(ID_PREFIXES.USER).toBe('usr')
  })
})
