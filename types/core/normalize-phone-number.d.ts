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
export function getLib(): {
  PhoneNumberUtil: any
  PhoneNumberFormat: any
}
/**
 * Lazy singleton accessor for PhoneNumberUtil.
 *
 * Ensures:
 * - Single instance per process
 * - No eager initialization cost
 *
 * @returns {any} PhoneNumberUtil instance
 */
export function phoneUtil(): any
/**
 * Normalize and validate an international phone number.
 *
 * Input MUST start with '+'.
 *
 * @param {string} input International phone number (E.164-like)
 * @returns {NormalizedPhone}
 * @throws {Error} If the phone number is invalid
 */
export function normalizePhoneOrThrowIntl(input: string): NormalizedPhone
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
export function normalizePhoneOrThrowWithRegion(
  input: string,
  defaultRegion: string,
): {
  e164: string
  national: string
  international: string
  regionCode: string | undefined
  type: number
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
export function normalizePhoneOrThrow(
  input: string,
  opts?: {
    defaultRegion?: string
  },
): NormalizedPhone
export type NormalizedPhone = {
  e164: string
  type: number
  national: string
  countryCode: number
  nationalClean: string
  international: string
  countryCodeE164: string
  internationalClean: string
  regionCode: string | undefined
}
