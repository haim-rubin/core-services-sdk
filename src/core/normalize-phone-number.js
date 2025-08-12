// src/core/phone-validate.js
// Validate & normalize using google-libphonenumber

import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

const phoneUtil = PhoneNumberUtil.getInstance()

/**
 * Trim and remove invisible RTL markers that can sneak in from copy/paste.
 * @param {string} input
 * @returns {string}
 */
function clean(input) {
  return String(input)
    .trim()
    .replace(/[\u200e\u200f]/g, '')
}

/**
 * Convert a parsed libphonenumber object into a normalized result.
 * @param {import('google-libphonenumber').PhoneNumber} parsed
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 */
function toResult(parsed) {
  return {
    e164: phoneUtil.format(parsed, PhoneNumberFormat.E164),
    national: phoneUtil.format(parsed, PhoneNumberFormat.NATIONAL),
    international: phoneUtil.format(parsed, PhoneNumberFormat.INTERNATIONAL),
    regionCode: phoneUtil.getRegionCodeForNumber(parsed),
    type: phoneUtil.getNumberType(parsed),
  }
}

/**
 * Parse & validate an international number (must start with '+').
 * Throws on invalid input.
 *
 * @param {string} input - International number, e.g. "+972541234567"
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If the number is invalid
 */
export function normalizePhoneOrThrowIntl(input) {
  try {
    const parsed = phoneUtil.parseAndKeepRawInput(clean(input))
    if (!phoneUtil.isValidNumber(parsed)) throw new Error('x')
    return toResult(parsed)
  } catch {
    throw new Error('Invalid phone number')
  }
}

/**
 * Parse & validate a national number using a region hint.
 * Throws on invalid input.
 *
 * @param {string} input - National number, e.g. "054-123-4567"
 * @param {string} defaultRegion - ISO region like "IL" or "US"
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If the number is invalid
 */
export function normalizePhoneOrThrowWithRegion(input, defaultRegion) {
  try {
    const parsed = phoneUtil.parseAndKeepRawInput(clean(input), defaultRegion)
    if (!phoneUtil.isValidNumber(parsed)) throw new Error('x')
    return toResult(parsed)
  } catch {
    throw new Error('Invalid phone number')
  }
}

/**
 * Smart normalization:
 * - If input starts with '+', parse as international.
 * - Otherwise require a defaultRegion and parse as national.
 * Throws on invalid input or when defaultRegion is missing for non-international numbers.
 *
 * @param {string} input
 * @param {{ defaultRegion?: string }} [opts]
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If invalid or defaultRegion is missing for non-international input
 */
export function normalizePhoneOrThrow(input, opts = {}) {
  const cleaned = clean(input)
  if (/^\+/.test(cleaned)) {
    return normalizePhoneOrThrowIntl(cleaned)
  }
  const { defaultRegion } = opts
  if (!defaultRegion) {
    // keep this one specific; your test relies on a different message here
    throw new Error('defaultRegion is required for non-international numbers')
  }
  return normalizePhoneOrThrowWithRegion(cleaned, defaultRegion)
}
