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
} from '../../src/ids/generators.js'
import { ID_PREFIXES } from '../../src/ids/prefixes.js'

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const testPrefixFunction = (fn, expectedPrefix) => {
  const id = fn()
  expect(typeof id).toBe('string')
  const [prefix, uuid] = id.split('_')
  expect(prefix).toBe(expectedPrefix)
  expect(uuid).toMatch(UUID_V4_REGEX)
}

describe('generateId', () => {
  it('generates a valid UUID v4', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id).toMatch(UUID_V4_REGEX)
  })

  it('generates unique UUIDs', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateId()))
    expect(ids.size).toBe(10)
  })
})

describe('generatePrefixedId', () => {
  it('generates an ID with the correct prefix', () => {
    const prefixed = generatePrefixedId('test')
    const [prefix, uuid] = prefixed.split('_')
    expect(prefix).toBe('test')
    expect(uuid).toMatch(UUID_V4_REGEX)
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
})
