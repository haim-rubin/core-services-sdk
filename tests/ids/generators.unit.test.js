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
  generateFileId,
  generateEventId,
  generateJobId,
  generateTaskId,
  generateQueueId,
  generateMessageId,
  generateNotificationId,
  generateLogId,
  generateAuditId,
  generateConfigId,
  generateKeyId,
  generateMetricId,
  generateTagId,
  generatePolicyId,
  generateProfileId,
  generateDeviceId,
  generateAlertId,
  generateResourceId,
} from '../../src/ids/generators.js'
import { ID_PREFIXES } from '../../src/ids/prefixes.js'

// ULID is a 26-character Base32 string (no I, L, O, U).
const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/

// @ts-ignore
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
    testPrefixFunction(generateRolePermissionsId, ID_PREFIXES.ROLE_PERMISSION)
  })

  it('generateSessionId returns ID with sess_ prefix', () => {
    testPrefixFunction(generateSessionId, ID_PREFIXES.SESSION)
  })

  it('generateFileId returns ID with fil_ prefix', () => {
    testPrefixFunction(generateFileId, ID_PREFIXES.FILE)
  })

  it('generateEventId returns ID with evt_ prefix', () => {
    testPrefixFunction(generateEventId, ID_PREFIXES.EVENT)
  })

  it('generateJobId returns ID with job_ prefix', () => {
    testPrefixFunction(generateJobId, ID_PREFIXES.JOB)
  })

  it('generateTaskId returns ID with task_ prefix', () => {
    testPrefixFunction(generateTaskId, ID_PREFIXES.TASK)
  })

  it('generateQueueId returns ID with que_ prefix', () => {
    testPrefixFunction(generateQueueId, ID_PREFIXES.QUEUE)
  })

  it('generateMessageId returns ID with msg_ prefix', () => {
    testPrefixFunction(generateMessageId, ID_PREFIXES.MESSAGE)
  })

  it('generateNotificationId returns ID with ntf_ prefix', () => {
    testPrefixFunction(generateNotificationId, ID_PREFIXES.NOTIFICATION)
  })

  it('generateLogId returns ID with log_ prefix', () => {
    testPrefixFunction(generateLogId, ID_PREFIXES.LOG)
  })

  it('generateAuditId returns ID with adt_ prefix', () => {
    testPrefixFunction(generateAuditId, ID_PREFIXES.AUDIT)
  })

  it('generateConfigId returns ID with cfg_ prefix', () => {
    testPrefixFunction(generateConfigId, ID_PREFIXES.CONFIG)
  })

  it('generateKeyId returns ID with key_ prefix', () => {
    testPrefixFunction(generateKeyId, ID_PREFIXES.KEY)
  })

  it('generateMetricId returns ID with met_ prefix', () => {
    testPrefixFunction(generateMetricId, ID_PREFIXES.METRIC)
  })

  it('generateTagId returns ID with tag_ prefix', () => {
    testPrefixFunction(generateTagId, ID_PREFIXES.TAG)
  })

  it('generatePolicyId returns ID with plc_ prefix', () => {
    testPrefixFunction(generatePolicyId, ID_PREFIXES.POLICY)
  })

  it('generateProfileId returns ID with prf_ prefix', () => {
    testPrefixFunction(generateProfileId, ID_PREFIXES.PROFILE)
  })

  it('generateDeviceId returns ID with dev_ prefix', () => {
    testPrefixFunction(generateDeviceId, ID_PREFIXES.DEVICE)
  })

  it('generateAlertId returns ID with alr_ prefix', () => {
    testPrefixFunction(generateAlertId, ID_PREFIXES.ALERT)
  })

  it('generateResourceId returns ID with res_ prefix', () => {
    testPrefixFunction(generateResourceId, ID_PREFIXES.RESOURCE)
  })
})
