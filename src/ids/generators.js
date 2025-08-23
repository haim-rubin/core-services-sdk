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
