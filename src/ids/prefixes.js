/**
 * Mapping of entity types to their unique ID prefixes.
 *
 * These prefixes are prepended to UUIDs to create consistent and identifiable IDs across the system.
 * For example: 'usr_550e8400-e29b-41d4-a716-446655440000'
 *
 * @readonly
 * @enum {string}
 */
export const ID_PREFIXES = Object.freeze({
  /** User entity ID prefix */
  USER: 'usr',

  /** Tenant entity ID prefix */
  TENANT: 'tnt',

  /** Permission entity ID prefix */
  PERMISSION: 'prm',

  /** Correlation ID prefix (e.g., for tracing requests) */
  CORRELATION: 'crln',

  /** Verification entity ID prefix (e.g., email/phone code) */
  VERIFICATION: 'vrf',

  /** Role-permissions mapping ID prefix */
  ROLE_PERMISSIONS: 'role',

  /** Onboarding mapping ID prefix */
  ONBOARDING: 'onb',
})
