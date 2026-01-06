import { describe, it, expect } from 'vitest'

import {
  generateId,
  generatePrefixedId,

  // Core
  generateUserId,
  generateTenantId,
  generateSessionId,
  generateOnboardingId,

  // Authorization
  generatePermissionId,
  generateRoleId,
  generateRolePermissionsId,
  generateVerificationId,
  generatePolicyId,
  generateProfileId,
  generateDeviceId,

  // Assets
  generateAssetId,
  generateAssetUploadId,
  generateFileId,

  // Accounting
  generateSupplierId,
  generateCustomerId,
  generateInvoiceId,
  generateInvoiceItemId,
  generateInvoiceCorrectionId,
  generatePaymentId,
  generateTransactionId,
  generateReceiptId,
  generateInvoiceReceiptId,
  generateCreditNoteId,
  generateDebitNoteId,
  generateProformaInvoiceId,
  generateDeliveryNoteId,
  generateOrderId,
  generateQuoteId,

  // AI / docs
  generateDocumentDataId,

  // Messaging / infra
  generateCorrelationId,
  generateEventId,
  generateJobId,
  generateTaskId,
  generateQueueId,
  generateMessageId,
  generateNotificationId,

  // Communication
  generateEmailId,
  generateIncomingEmailId,
  generateImId,

  // Observability
  generateLogId,
  generateAuditId,
  generateMetricId,

  // Misc
  generateConfigId,
  generateKeyId,
  generateTagId,
  generateAlertId,
  generateResourceId,

  // Bots
  generateBotFlowId,
} from '../../src/ids/generators.js'

import { ID_PREFIXES } from '../../src/ids/prefixes.js'

// ULID is a 26-character Base32 string (no I, L, O, U).
const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/

/**
 * Helper to test prefixed ID generators.
 *
 * @param {Function} fn
 * @param {string} expectedPrefix
 */
const testPrefixFunction = (fn, expectedPrefix) => {
  const id = fn()
  expect(typeof id).toBe('string')

  const [prefix, ulid] = id.split('_')
  expect(prefix).toBe(expectedPrefix)
  expect(ulid).toMatch(ULID_REGEX)
}

describe('generateId', () => {
  it('generates a valid ULID', () => {
    const id = generateId()
    expect(id).toMatch(ULID_REGEX)
  })

  it('generates unique ULIDs', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateId()))
    expect(ids.size).toBe(10)
  })
})

describe('generatePrefixedId', () => {
  it('generates an ID with the given prefix', () => {
    const id = generatePrefixedId('test')
    const [prefix, ulid] = id.split('_')

    expect(prefix).toBe('test')
    expect(ulid).toMatch(ULID_REGEX)
  })
})

describe('generate*Id functions', () => {
  it('core identity', () => {
    testPrefixFunction(generateUserId, ID_PREFIXES.USER)
    testPrefixFunction(generateTenantId, ID_PREFIXES.TENANT)
    testPrefixFunction(generateSessionId, ID_PREFIXES.SESSION)
    testPrefixFunction(generateOnboardingId, ID_PREFIXES.ONBOARDING)
  })

  it('authorization & access', () => {
    testPrefixFunction(generatePermissionId, ID_PREFIXES.PERMISSION)
    testPrefixFunction(generateRoleId, ID_PREFIXES.ROLE)
    testPrefixFunction(generateRolePermissionsId, ID_PREFIXES.ROLE_PERMISSION)
    testPrefixFunction(generateVerificationId, ID_PREFIXES.VERIFICATION)
    testPrefixFunction(generatePolicyId, ID_PREFIXES.POLICY)
    testPrefixFunction(generateProfileId, ID_PREFIXES.PROFILE)
    testPrefixFunction(generateDeviceId, ID_PREFIXES.DEVICE)
  })

  it('assets & files', () => {
    testPrefixFunction(generateAssetId, ID_PREFIXES.ASSET)
    testPrefixFunction(generateAssetUploadId, ID_PREFIXES.ASSET_UPLOAD)
    testPrefixFunction(generateFileId, ID_PREFIXES.FILE)
  })

  it('accounting domain', () => {
    testPrefixFunction(generateSupplierId, ID_PREFIXES.SUPPLIER)
    testPrefixFunction(generateCustomerId, ID_PREFIXES.CUSTOMER)
    testPrefixFunction(generateInvoiceId, ID_PREFIXES.INVOICE)
    testPrefixFunction(generateInvoiceItemId, ID_PREFIXES.INVOICE_ITEM)
    testPrefixFunction(
      generateInvoiceCorrectionId,
      ID_PREFIXES.INVOICE_CORRECTION,
    )
    testPrefixFunction(generatePaymentId, ID_PREFIXES.PAYMENT)
    testPrefixFunction(generateTransactionId, ID_PREFIXES.TRANSACTION)
    testPrefixFunction(generateReceiptId, ID_PREFIXES.RECEIPT)
    testPrefixFunction(generateInvoiceReceiptId, ID_PREFIXES.INVOICE_RECEIPT)
    testPrefixFunction(generateCreditNoteId, ID_PREFIXES.CREDIT_NOTE)
    testPrefixFunction(generateDebitNoteId, ID_PREFIXES.DEBIT_NOTE)
    testPrefixFunction(generateProformaInvoiceId, ID_PREFIXES.PROFORMA_INVOICE)
    testPrefixFunction(generateDeliveryNoteId, ID_PREFIXES.DELIVERY_NOTE)
    testPrefixFunction(generateOrderId, ID_PREFIXES.ORDER)
    testPrefixFunction(generateQuoteId, ID_PREFIXES.QUOTE)
  })

  it('ai / document processing', () => {
    testPrefixFunction(generateDocumentDataId, ID_PREFIXES.DOCUMENT_DATA)
  })

  it('messaging / infra', () => {
    testPrefixFunction(generateCorrelationId, ID_PREFIXES.CORRELATION)
    testPrefixFunction(generateEventId, ID_PREFIXES.EVENT)
    testPrefixFunction(generateJobId, ID_PREFIXES.JOB)
    testPrefixFunction(generateTaskId, ID_PREFIXES.TASK)
    testPrefixFunction(generateQueueId, ID_PREFIXES.QUEUE)
    testPrefixFunction(generateMessageId, ID_PREFIXES.MESSAGE)
    testPrefixFunction(generateNotificationId, ID_PREFIXES.NOTIFICATION)
  })

  it('communication', () => {
    testPrefixFunction(generateEmailId, ID_PREFIXES.EMAIL)
    testPrefixFunction(generateIncomingEmailId, ID_PREFIXES.INCOMING_EMAIL)
    testPrefixFunction(generateImId, ID_PREFIXES.IM)
  })

  it('observability', () => {
    testPrefixFunction(generateLogId, ID_PREFIXES.LOG)
    testPrefixFunction(generateAuditId, ID_PREFIXES.AUDIT)
    testPrefixFunction(generateMetricId, ID_PREFIXES.METRIC)
  })

  it('misc / config', () => {
    testPrefixFunction(generateConfigId, ID_PREFIXES.CONFIG)
    testPrefixFunction(generateKeyId, ID_PREFIXES.KEY)
    testPrefixFunction(generateTagId, ID_PREFIXES.TAG)
    testPrefixFunction(generateAlertId, ID_PREFIXES.ALERT)
    testPrefixFunction(generateResourceId, ID_PREFIXES.RESOURCE)
  })

  it('bots / automation', () => {
    testPrefixFunction(generateBotFlowId, ID_PREFIXES.BOT_FLOW)
  })
})
