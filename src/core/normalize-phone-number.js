// normalize-phone-number.js
// Works with both CJS and ESM builds of google-libphonenumber

import * as raw from 'google-libphonenumber'

/**
 * @typedef {Object} NormalizedPhone
 * @property {string} e164
 * @property {number} type
 * @property {string} national
 * @property {number} countryCode
 * @property {string} nationalClean
 * @property {string} international
 * @property {string} countryCodeE164
 * @property {string} internationalClean
 * @property {string | undefined} regionCode
 */

/**
 * normalize-phone-number.js
 *
 * Utilities for parsing, validating, and normalizing phone numbers
 * using google-libphonenumber.
 *
 * Supports both ESM and CJS interop builds.
 * All normalization outputs are canonical and safe for persistence,
 * comparison, indexing, and login identifiers.
 */

/**
 * Resolve google-libphonenumber exports regardless of ESM / CJS shape.
 *
 * Some builds expose:
 *   - raw.PhoneNumberUtil
 * Others expose:
 *   - raw.default.PhoneNumberUtil
 *
 * This helper guarantees a consistent API.
 *
 * @returns {{
 *   PhoneNumberUtil: any,
 *   PhoneNumberFormat: any
 * }}
 * @throws {Error} If required exports are missing
 */
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

/**
 * Lazy singleton accessor for PhoneNumberUtil.
 *
 * Ensures:
 * - Single instance per process
 * - No eager initialization cost
 *
 * @returns {any} PhoneNumberUtil instance
 */
export function phoneUtil() {
  if (!_util) {
    const { PhoneNumberUtil } = getLib()
    _util = PhoneNumberUtil.getInstance()
  }
  return _util
}

/**
 * Internal helper returning PhoneNumberFormat enum.
 *
 * @returns {any} PhoneNumberFormat enum
 */
function formats() {
  const { PhoneNumberFormat } = getLib()
  return PhoneNumberFormat
}

/**
 * Cleans user input before parsing:
 * - Trims whitespace
 * - Removes invisible RTL/LTR markers
 *
 * Does NOT remove digits, plus sign, or formatting characters.
 *
 * @param {string} input Raw user input
 * @returns {string} Cleaned input string
 */
function clean(input) {
  return String(input)
    .trim()
    .replace(/[\u200e\u200f]/g, '')
}

/**
 * Converts a parsed google-libphonenumber object into a normalized result.
 *
 * Returned formats:
 * - e164: Canonical phone number in E.164 format.
 *   Intended for storage, indexing, comparison, login identifiers, and OTP flows.
 *
 * - national: Local, human-readable phone number representation.
 *   May include formatting characters such as dashes or spaces.
 *
 * - nationalClean: Local phone number containing digits only.
 *
 * - international: Human-readable international representation.
 *
 * - internationalClean: International phone number containing digits only,
 *   without '+' or formatting characters.
 *
 * - regionCode: ISO 3166-1 alpha-2 region code (e.g. "IL").
 *
 * - countryCallingCode: Numeric international dialing code (e.g. 972).
 *
 * - countryCallingCodeE164: International dialing code with '+' prefix (e.g. "+972").
 *
 * Notes:
 * - Only `e164` should be persisted or used for identity comparison.
 * - All other formats are intended strictly for UI, display, copy, or integrations.
 *
 * @param {any} parsed
 *   Parsed phone number object returned by google-libphonenumber.
 *
 * @returns {NormalizedPhone}
 */

function toResult(parsed) {
  const PNF = formats()
  const util = phoneUtil()

  const results = {
    type: util.getNumberType(parsed),
    e164: util.format(parsed, PNF.E164),
    national: util.format(parsed, PNF.NATIONAL),
    regionCode: util.getRegionCodeForNumber(parsed),
    international: util.format(parsed, PNF.INTERNATIONAL),
  }

  const countryCode = `${parsed.getCountryCode()}`

  return {
    ...results,
    countryCode,
    countryCodeE164: `+${countryCode}`,
    nationalClean: results.national.replace(/\D/g, ''),
    internationalClean: results.e164.replace(/\D/g, ''),
  }
}

/**
 * Normalize and validate an international phone number.
 *
 * Input MUST start with '+'.
 *
 * @param {string} input International phone number (E.164-like)
 * @returns {NormalizedPhone}
 * @throws {Error} If the phone number is invalid
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
 * Normalize and validate a national phone number using a region hint.
 *
 * Example:
 *   input: "0523444444"
 *   defaultRegion: "IL"
 *
 * @param {string} input National phone number
 * @param {string} defaultRegion ISO 3166-1 alpha-2 country code
 * @returns {{
 *   e164: string,
 *   national: string,
 *   international: string,
 *   regionCode: string | undefined,
 *   type: number
 * }}
 * @throws {Error} If the phone number is invalid
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
 * Smart normalization entry point.
 *
 * Behavior:
 * - If input starts with '+', parses as international
 * - Otherwise requires defaultRegion and parses as national
 *
 * This is the recommended function for login, signup, and verification flows.
 *
 * @param {string} input Phone number (international or national)
 * @param {{
 *   defaultRegion?: string
 * }} [opts]
 *
 * @returns {NormalizedPhone}
 * @throws {Error} If invalid or defaultRegion is missing
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
