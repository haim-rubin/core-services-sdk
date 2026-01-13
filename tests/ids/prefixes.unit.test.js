// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { ID_PREFIXES } from '../../src/ids/prefixes.js'

describe('ID_PREFIXES', () => {
  it('contains expected keys and values', () => {
    expect(ID_PREFIXES).toEqual({
      // Core identity
      USER: 'usr',
      TENANT: 'tnt',
      SESSION: 'sess',
      ONBOARDING: 'onb',

      // Authorization & access
      ROLE: 'role',
      PERMISSION: 'prm',
      ROLE_PERMISSION: 'rprm',
      VERIFICATION: 'vrf',
      POLICY: 'plc',
      PROFILE: 'prf',
      DEVICE: 'dev',

      // Assets & uploads
      ASSET: 'ast',
      ASSET_UPLOAD: 'aupl',

      // Legacy
      FILE: 'fil',

      // Accounting domain
      SUPPLIER: 'sup',
      CUSTOMER: 'cust',
      COUNTERPARTY: 'ctp',
      INVOICE: 'inv',
      INVOICE_ITEM: 'invi',
      INVOICE_CORRECTION: 'invc',
      PAYMENT: 'pay',
      TRANSACTION: 'txn',
      RECEIPT: 'rcp',
      INVOICE_RECEIPT: 'invrcp',
      CREDIT_NOTE: 'crn',
      DEBIT_NOTE: 'dbn',
      PROFORMA_INVOICE: 'pfi',
      DELIVERY_NOTE: 'dln',
      ORDER: 'ord',
      QUOTE: 'qte',

      // AI / document processing
      DOCUMENT_DATA: 'docd',

      // Messaging / jobs / infra
      CORRELATION: 'crln',
      EVENT: 'evt',
      JOB: 'job',
      TASK: 'task',
      QUEUE: 'que',
      MESSAGE: 'msg',
      NOTIFICATION: 'ntf',

      // Communication
      EMAIL: 'eml',
      INCOMING_EMAIL: 'ieml',
      IM: 'im',

      // Observability
      AUDIT: 'adt',
      LOG: 'log',
      METRIC: 'met',

      // Misc / config
      TAG: 'tag',
      CONFIG: 'cfg',
      KEY: 'key',
      RESOURCE: 'res',
      ALERT: 'alr',

      // Bots / automation flows
      BOT_FLOW: 'botf',
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

    try {
      ID_PREFIXES.USER = 'hacked'
    } catch {
      // ignore
    }

    expect(ID_PREFIXES.USER).toBe('usr')
  })
})
