import { v4 as uuidv4 } from 'uuid'
import { ID_PREFIXES } from './prefixes.js'

/**
 * Generates a new UUID v4 string.
 *
 * @returns {string} A new UUID (version 4).
 *
 * @example
 * generateId() // '550e8400-e29b-41d4-a716-446655440000'
 */
export const generateId = () => {
  return uuidv4()
}

/**
 * Generates a unique ID with the given prefix.
 *
 * @param {string} prefix - A prefix string to prepend to the UUID.
 * @returns {string} A unique ID in the format `${prefix}_${uuid}`.
 *
 * @example
 * generatePrefixedId('usr') // 'usr_550e8400-e29b-41d4-a716-446655440000'
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
 * Generates a onboarding ID with a `onb_` prefix.
 *
 * @returns {string} A onboarding ID.
 */
export const generateOnboardingId = () =>
  generatePrefixedId(ID_PREFIXES.ONBOARDING)
