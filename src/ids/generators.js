import { ulid } from 'ulid'
import { ID_PREFIXES } from './prefixes.js'

/**
 * Generates a new ULID string.
 *
 * ULIDs are 26-character, lexicographically sortable identifiers.
 *
 * @returns {string} A new ULID.
 *
 * @example
 * generateId() // '01HZY3M7K4FJ9A8Q4Y1ZB5NX3T'
 */
export const generateId = () => {
  return ulid()
}

/**
 * Generates a unique ID with the given prefix.
 *
 * @param {string} prefix - A prefix string to prepend to the ULID.
 * @returns {string} A unique ID in the format `${prefix}_${ulid}`.
 *
 * @example
 * generatePrefixedId('usr') // 'usr_01HZY3M7K4FJ9A8Q4Y1ZB5NX3T'
 */
export const generatePrefixedId = (prefix) => {
  return `${prefix}_${generateId()}`
}

/**
 * Generates a user ID with a `usr_` prefix.
 *
 * @returns {string} A user ID.
 */
export const generateUserId = () => generatePrefixedId(ID_PREFIXES.USER)

/**
 * Generates a tenant ID with a `tnt_` prefix.
 *
 * @returns {string} A tenant ID.
 */
export const generateTenantId = () => generatePrefixedId(ID_PREFIXES.TENANT)

/**
 * Generates a permission ID with a `prm_` prefix.
 *
 * @returns {string} A permission ID.
 */
export const generatePermissionId = () =>
  generatePrefixedId(ID_PREFIXES.PERMISSION)

/**
 * Generates a correlation ID with a `crln_` prefix.
 *
 * @returns {string} A correlation ID.
 */
export const generateCorrelationId = () =>
  generatePrefixedId(ID_PREFIXES.CORRELATION)

/**
 * Generates a verification ID with a `vrf_` prefix.
 *
 * @returns {string} A verification ID.
 */
export const generateVerificationId = () =>
  generatePrefixedId(ID_PREFIXES.VERIFICATION)

/**
 * Generates a role permissions ID with a `role_` prefix.
 *
 * @returns {string} A role permissions ID.
 */
export const generateRolePermissionsId = () =>
  generatePrefixedId(ID_PREFIXES.ROLE_PERMISSIONS)

/**
 * Generates an onboarding ID with a `onb_` prefix.
 *
 * @returns {string} An onboarding ID.
 */
export const generateOnboardingId = () =>
  generatePrefixedId(ID_PREFIXES.ONBOARDING)

/**
 * Generates a session ID with a `sess_` prefix.
 *
 * @returns {string} A session ID.
 */
export const generateSessionId = () => generatePrefixedId(ID_PREFIXES.SESSION)

/**
 * Generates a file ID with a `fil_` prefix.
 *
 * @returns {string} A file ID.
 */
export const generateFileId = () => generatePrefixedId(ID_PREFIXES.FILE)

/**
 * Generates an event ID with an `evt_` prefix.
 *
 * @returns {string} An event ID.
 */
export const generateEventId = () => generatePrefixedId(ID_PREFIXES.EVENT)

/**
 * Generates a job ID with a `job_` prefix.
 *
 * @returns {string} A job ID.
 */
export const generateJobId = () => generatePrefixedId(ID_PREFIXES.JOB)

/**
 * Generates a task ID with a `task_` prefix.
 *
 * @returns {string} A task ID.
 */
export const generateTaskId = () => generatePrefixedId(ID_PREFIXES.TASK)

/**
 * Generates a queue ID with a `que_` prefix.
 *
 * @returns {string} A queue ID.
 */
export const generateQueueId = () => generatePrefixedId(ID_PREFIXES.QUEUE)

/**
 * Generates a message ID with a `msg_` prefix.
 *
 * @returns {string} A message ID.
 */
export const generateMessageId = () => generatePrefixedId(ID_PREFIXES.MESSAGE)

/**
 * Generates a notification ID with a `ntf_` prefix.
 *
 * @returns {string} A notification ID.
 */
export const generateNotificationId = () =>
  generatePrefixedId(ID_PREFIXES.NOTIFICATION)

/**
 * Generates a log ID with a `log_` prefix.
 *
 * @returns {string} A log ID.
 */
export const generateLogId = () => generatePrefixedId(ID_PREFIXES.LOG)

/**
 * Generates an audit ID with an `adt_` prefix.
 *
 * @returns {string} An audit ID.
 */
export const generateAuditId = () => generatePrefixedId(ID_PREFIXES.AUDIT)

/**
 * Generates a config ID with a `cfg_` prefix.
 *
 * @returns {string} A config ID.
 */
export const generateConfigId = () => generatePrefixedId(ID_PREFIXES.CONFIG)

/**
 * Generates a key ID with a `key_` prefix.
 *
 * @returns {string} A key ID.
 */
export const generateKeyId = () => generatePrefixedId(ID_PREFIXES.KEY)

/**
 * Generates a metric ID with a `met_` prefix.
 *
 * @returns {string} A metric ID.
 */
export const generateMetricId = () => generatePrefixedId(ID_PREFIXES.METRIC)

/**
 * Generates a tag ID with a `tag_` prefix.
 *
 * @returns {string} A tag ID.
 */
export const generateTagId = () => generatePrefixedId(ID_PREFIXES.TAG)

/**
 * Generates a policy ID with a `plc_` prefix.
 *
 * @returns {string} A policy ID.
 */
export const generatePolicyId = () => generatePrefixedId(ID_PREFIXES.POLICY)

/**
 * Generates a profile ID with a `prf_` prefix.
 *
 * @returns {string} A profile ID.
 */
export const generateProfileId = () => generatePrefixedId(ID_PREFIXES.PROFILE)

/**
 * Generates a device ID with a `dev_` prefix.
 *
 * @returns {string} A device ID.
 */
export const generateDeviceId = () => generatePrefixedId(ID_PREFIXES.DEVICE)

/**
 * Generates an alert ID with an `alr_` prefix.
 *
 * @returns {string} An alert ID.
 */
export const generateAlertId = () => generatePrefixedId(ID_PREFIXES.ALERT)

/**
 * Generates a resource ID with a `res_` prefix.
 *
 * @returns {string} A resource ID.
 */
export const generateResourceId = () => generatePrefixedId(ID_PREFIXES.RESOURCE)

/**
 * Generates a resource ID with a `ieml_` prefix.
 *
 * @returns {string} An incoming email ID.
 */
export const generateIncomingEmailId = () =>
  generatePrefixedId(ID_PREFIXES.INCOMING_EMAIL)

/**
 * Generates a resource ID with a `eml_` prefix.
 *
 * @returns {string} An Email ID.
 */
export const generateEmailId = () => generatePrefixedId(ID_PREFIXES.EMAIL)

/**
 * Generates a resource ID with a `im_` prefix.
 *
 * @returns {string} An Instant Message ID.
 */
export const generateImId = () => generatePrefixedId(ID_PREFIXES.IM)
