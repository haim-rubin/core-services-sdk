// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { ID_PREFIXES } from '../../src/ids/prefixes.js'

describe('ID_PREFIXES', () => {
  it('contains expected keys and values', () => {
    expect(ID_PREFIXES).toEqual({
      ALERT: 'alr',
      ASSET: 'ast',
      ASSET_UPLOAD: 'aupl',
      AUDIT: 'adt',
      BOT_FLOW: 'botf',
      CONFIG: 'cfg',
      CORRELATION: 'crln',
      DEVICE: 'dev',
      DOCUMENT_DATA: 'docd',
      EMAIL: 'eml',
      EVENT: 'evt',
      FILE: 'fil',
      IM: 'im',
      INCOMING_EMAIL: 'ieml',
      INVOICE: 'inv',
      INVOICE_CORRECTION: 'invc',
      INVOICE_ITEM: 'invi',
      JOB: 'job',
      KEY: 'key',
      LOG: 'log',
      MESSAGE: 'msg',
      METRIC: 'met',
      NOTIFICATION: 'ntf',
      ONBOARDING: 'onb',
      PERMISSION: 'prm',
      POLICY: 'plc',
      PROFILE: 'prf',
      QUEUE: 'que',
      RESOURCE: 'res',
      ROLE: 'role',
      ROLE_PERMISSION: 'rprm',
      SESSION: 'sess',
      SUPPLIER: 'sup',
      TAG: 'tag',
      TASK: 'task',
      TENANT: 'tnt',
      USER: 'usr',
      VERIFICATION: 'vrf',
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
