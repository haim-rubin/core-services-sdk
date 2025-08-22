// normalize-phone-number.js
// Works with both CJS and ESM builds of google-libphonenumber

import * as raw from 'google-libphonenumber'

/** Resolve libphonenumber regardless of interop shape */
export function getLib() {
  // Prefer direct (CJS-style or ESM w/ named), else default
  // e.g. raw.PhoneNumberUtil OR raw.default.PhoneNumberUtil
  /** @type {any} */
  const anyRaw = raw
  const lib = anyRaw.PhoneNumberUtil ? anyRaw : (anyRaw.default ?? anyRaw)

  if (!lib || !lib.PhoneNumberUtil || !lib.PhoneNumberFormat) {
    throw new Error('google-libphonenumber failed to load (exports not found)')
  }
  return lib
}

let _util // lazy singleton

export function phoneUtil() {
  if (!_util) {
    const { PhoneNumberUtil } = getLib()
    _util = PhoneNumberUtil.getInstance()
  }
  return _util
}

function formats() {
  const { PhoneNumberFormat } = getLib()
  return PhoneNumberFormat
}

/**
 * Trim and remove invisible RTL markers.
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
 * @param {any} parsed
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 */
function toResult(parsed) {
  const PNF = formats()
  const util = phoneUtil()
  return {
    e164: util.format(parsed, PNF.E164),
    national: util.format(parsed, PNF.NATIONAL),
    international: util.format(parsed, PNF.INTERNATIONAL),
    regionCode: util.getRegionCodeForNumber(parsed),
    type: util.getNumberType(parsed),
  }
}

/**
 * Parse & validate an international number (must start with '+').
 * @param {string} input
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If the number is invalid
 */
export function normalizePhoneOrThrowIntl(input) {
  try {
    const util = phoneUtil()
    const parsed = util.parseAndKeepRawInput(clean(input))
    if (!util.isValidNumber(parsed)) {
      throw new Error('Phone number failed validation')
    }
    return toResult(parsed)
  } catch (e) {
    const err = new Error('Invalid phone number')
    err.cause = e
    throw err
  }
}

/**
 * Parse & validate a national number using a region hint.
 * @param {string} input
 * @param {string} defaultRegion
 * @returns {{e164:string,national:string,international:string,regionCode:string|undefined,type:number}}
 * @throws {Error} If the number is invalid
 */
export function normalizePhoneOrThrowWithRegion(input, defaultRegion) {
  try {
    const util = phoneUtil()
    const parsed = util.parseAndKeepRawInput(clean(input), defaultRegion)
    if (!util.isValidNumber(parsed)) {
      throw new Error('Phone number failed validation')
    }
    return toResult(parsed)
  } catch (e) {
    const err = new Error('Invalid phone number')
    err.cause = e
    throw err
  }
}

/**
 * Smart normalization:
 * - If input starts with '+', parse as international.
 * - Otherwise require a defaultRegion and parse as national.
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
    throw new Error('defaultRegion is required for non-international numbers')
  }
  return normalizePhoneOrThrowWithRegion(cleaned, defaultRegion)
}
