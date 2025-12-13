import { ulid } from 'ulid'
import { ID_PREFIXES } from './prefixes.js'

/**
 * Generates a new ULID string.
 *
 * @returns {string}
 */
export const generateId = () => {
  return ulid()
}

/**
 * Generates a unique ID with the given prefix.
 *
 * @param {string} prefix
 * @returns {string}
 */
export const generatePrefixedId = (prefix) => {
  return `${prefix}_${generateId()}`
}

/* =========================
 * Core identity
 * ========================= */

export const generateUserId = () => generatePrefixedId(ID_PREFIXES.USER)

export const generateTenantId = () => generatePrefixedId(ID_PREFIXES.TENANT)

export const generateSessionId = () => generatePrefixedId(ID_PREFIXES.SESSION)

export const generateOnboardingId = () =>
  generatePrefixedId(ID_PREFIXES.ONBOARDING)

/* =========================
 * Authorization
 * ========================= */

export const generatePermissionId = () =>
  generatePrefixedId(ID_PREFIXES.PERMISSION)

export const generateRoleId = () => generatePrefixedId(ID_PREFIXES.ROLE)

export const generateRolePermissionsId = () =>
  generatePrefixedId(ID_PREFIXES.ROLE_PERMISSION)

export const generateVerificationId = () =>
  generatePrefixedId(ID_PREFIXES.VERIFICATION)

/* =========================
 * Assets & uploads
 * ========================= */

export const generateAssetId = () => generatePrefixedId(ID_PREFIXES.ASSET)

export const generateAssetUploadId = () =>
  generatePrefixedId(ID_PREFIXES.ASSET_UPLOAD)

/* =========================
 * Files (legacy)
 * ========================= */

export const generateFileId = () => generatePrefixedId(ID_PREFIXES.FILE)

/* =========================
 * Accounting
 * ========================= */

export const generateSupplierId = () => generatePrefixedId(ID_PREFIXES.SUPPLIER)

export const generateInvoiceId = () => generatePrefixedId(ID_PREFIXES.INVOICE)

export const generateInvoiceItemId = () =>
  generatePrefixedId(ID_PREFIXES.INVOICE_ITEM)

export const generateInvoiceCorrectionId = () =>
  generatePrefixedId(ID_PREFIXES.INVOICE_CORRECTION)

/* =========================
 * AI / document processing
 * ========================= */

export const generateDocumentDataId = () =>
  generatePrefixedId(ID_PREFIXES.DOCUMENT_DATA)

/* =========================
 * Bots / automation
 * ========================= */

export const generateBotFlowId = () => generatePrefixedId(ID_PREFIXES.BOT_FLOW)

/* =========================
 * Infra / messaging
 * ========================= */

export const generateCorrelationId = () =>
  generatePrefixedId(ID_PREFIXES.CORRELATION)

export const generateEventId = () => generatePrefixedId(ID_PREFIXES.EVENT)

export const generateJobId = () => generatePrefixedId(ID_PREFIXES.JOB)

export const generateTaskId = () => generatePrefixedId(ID_PREFIXES.TASK)

export const generateQueueId = () => generatePrefixedId(ID_PREFIXES.QUEUE)

export const generateMessageId = () => generatePrefixedId(ID_PREFIXES.MESSAGE)

/* =========================
 * Communication
 * ========================= */

export const generateEmailId = () => generatePrefixedId(ID_PREFIXES.EMAIL)

export const generateIncomingEmailId = () =>
  generatePrefixedId(ID_PREFIXES.INCOMING_EMAIL)

export const generateImId = () => generatePrefixedId(ID_PREFIXES.IM)

export const generateNotificationId = () =>
  generatePrefixedId(ID_PREFIXES.NOTIFICATION)

/* =========================
 * Observability
 * ========================= */

export const generateAuditId = () => generatePrefixedId(ID_PREFIXES.AUDIT)

export const generateLogId = () => generatePrefixedId(ID_PREFIXES.LOG)

export const generateMetricId = () => generatePrefixedId(ID_PREFIXES.METRIC)

/* =========================
 * Security / config / misc
 * ========================= */

export const generateKeyId = () => generatePrefixedId(ID_PREFIXES.KEY)

export const generatePolicyId = () => generatePrefixedId(ID_PREFIXES.POLICY)

export const generateProfileId = () => generatePrefixedId(ID_PREFIXES.PROFILE)

export const generateDeviceId = () => generatePrefixedId(ID_PREFIXES.DEVICE)

export const generateAlertId = () => generatePrefixedId(ID_PREFIXES.ALERT)

export const generateResourceId = () => generatePrefixedId(ID_PREFIXES.RESOURCE)

export const generateTagId = () => generatePrefixedId(ID_PREFIXES.TAG)

export const generateConfigId = () => generatePrefixedId(ID_PREFIXES.CONFIG)
