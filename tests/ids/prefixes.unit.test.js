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
      ONBOARDING: 'onb',
      SESSION: 'sess',
      FILE: 'fil',
      EVENT: 'evt',
      JOB: 'job',
      TASK: 'task',
      QUEUE: 'que',
      MESSAGE: 'msg',
      NOTIFICATION: 'ntf',
      LOG: 'log',
      AUDIT: 'adt',
      CONFIG: 'cfg',
      KEY: 'key',
      METRIC: 'met',
      TAG: 'tag',
      POLICY: 'plc',
      PROFILE: 'prf',
      DEVICE: 'dev',
      ALERT: 'alr',
      RESOURCE: 'res',
      INCOMING_EMAIL: 'ieml',
      EMAIL: 'eml',
      IM: 'im',
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
    } catch {
      // Ignore error in strict mode
    }

    expect(ID_PREFIXES.USER).toBe('usr')
  })
})
