import { describe, it, expect } from 'vitest'

import {
  generateId,
  generateUserId,
  generateTenantId,
  generatePrefixedId,
  generatePermissionId,
  generateOnboardingId,
  generateCorrelationId,
  generateVerificationId,
  generateRolePermissionsId,
  generateSessionId,
} from '../../src/ids/generators.js'
import { ID_PREFIXES } from '../../src/ids/prefixes.js'

// ULID is a 26-character Base32 string (no I, L, O, U).
const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/

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
    expect(typeof id).toBe('string')
    expect(id).toMatch(ULID_REGEX)
  })

  it('generates unique ULIDs', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateId()))
    expect(ids.size).toBe(10)
  })
})

describe('generatePrefixedId', () => {
  it('generates an ID with the correct prefix', () => {
    const prefixed = generatePrefixedId('test')
    const [prefix, ulid] = prefixed.split('_')
    expect(prefix).toBe('test')
    expect(ulid).toMatch(ULID_REGEX)
  })
})

describe('generate*Id functions', () => {
  it('generateUserId returns ID with usr_ prefix', () => {
    testPrefixFunction(generateUserId, ID_PREFIXES.USER)
  })

  it('generateTenantId returns ID with tnt_ prefix', () => {
    testPrefixFunction(generateTenantId, ID_PREFIXES.TENANT)
  })

  it('generateOnboardingId returns ID with onb_ prefix', () => {
    testPrefixFunction(generateOnboardingId, ID_PREFIXES.ONBOARDING)
  })

  it('generatePermissionId returns ID with prm_ prefix', () => {
    testPrefixFunction(generatePermissionId, ID_PREFIXES.PERMISSION)
  })

  it('generateCorrelationId returns ID with crln_ prefix', () => {
    testPrefixFunction(generateCorrelationId, ID_PREFIXES.CORRELATION)
  })

  it('generateVerificationId returns ID with vrf_ prefix', () => {
    testPrefixFunction(generateVerificationId, ID_PREFIXES.VERIFICATION)
  })

  it('generateRolePermissionsId returns ID with role_ prefix', () => {
    testPrefixFunction(generateRolePermissionsId, ID_PREFIXES.ROLE_PERMISSIONS)
  })

  it('generateSessionId returns ID with sess_ prefix', () => {
    testPrefixFunction(generateSessionId, ID_PREFIXES.SESSION)
  })
})
