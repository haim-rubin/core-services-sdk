/**
 * Generates a one-time password (OTP) code based on a specified type or character set.
 *
 * @param {Object} [options={}] - The options object.
 * @param {number} [options.length=4] - The desired length of the generated code (1-30).
 * @param {string} [options.type='numeric'] - The type of characters to use. One of:
 *  'any', 'alpha', 'numeric', 'symbols', 'alphaLower', 'alphaUpper', 'alphanumeric', 'alphanumericSymbols'.
 * @param {string} [options.charset] - A custom string of characters to use instead of the predefined types.
 * @returns {string} The generated code.
 * @throws {Error} If the length is not a number between 1 and 30.
 * @throws {Error} If charset is provided and is not a non-empty string.
 * @throws {Error} If the type is invalid and no valid charset is provided.
 */
export function generateCode({
  length,
  type,
  charset,
}?: {
  length?: number
  type?: string
  charset?: string
}): string
/**
 * Generates an OTP code using alphabetic characters (both lowercase and uppercase).
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeAlpha(length?: number): string
/**
 * Generates an OTP code using only numeric digits (0-9).
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeDigits(length?: number): string
/**
 * Generates an OTP code using alphabetic characters and digits.
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeAlphaNumeric(length?: number): string
/**
 * Generates an OTP code using alphabetic characters, digits, and symbols.
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeAlphaNumericSymbols(length?: number): string
export const OTP_GENERATOR_TYPES: Readonly<{
  any: 'any'
  alpha: 'alpha'
  numeric: 'numeric'
  symbols: 'symbols'
  alphaLower: 'alphaLower'
  alphaUpper: 'alphaUpper'
  alphanumeric: 'alphanumeric'
  alphanumericSymbols: 'alphanumericSymbols'
}>
