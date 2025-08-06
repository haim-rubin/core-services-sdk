const numeric = '0123456789'
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const alphaLower = 'abcdefghijklmnopqrstuvwxyz'
const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const alphanumericSymbols = `${alphaLower}${alphaUpper}${numeric}${symbols}`

export const OTP_GENERATOR_TYPES = Object.freeze({
  any: 'any',
  alpha: 'alpha',
  numeric: 'numeric',
  symbols: 'symbols',
  alphaLower: 'alphaLower',
  alphaUpper: 'alphaUpper',
  alphanumeric: 'alphanumeric',
  alphanumericSymbols: 'alphanumericSymbols',
})

const types = Object.freeze({
  [OTP_GENERATOR_TYPES.numeric]: numeric,
  [OTP_GENERATOR_TYPES.symbols]: symbols,
  [OTP_GENERATOR_TYPES.alphaLower]: alphaLower,
  [OTP_GENERATOR_TYPES.alphaUpper]: alphaUpper,
  [OTP_GENERATOR_TYPES.any]: alphanumericSymbols,
  [OTP_GENERATOR_TYPES.alpha]: `${alphaLower}${alphaUpper}`,
  [OTP_GENERATOR_TYPES.alphanumericSymbols]: alphanumericSymbols,
  [OTP_GENERATOR_TYPES.alphanumeric]: `${alphaLower}${alphaUpper}${numeric}`,
})

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
export function generateCode({ length = 4, type = 'numeric', charset } = {}) {
  const max = 30
  const min = 1

  if (typeof length !== 'number' || length < min || length > max) {
    throw new Error(`length must be a number between ${min} and ${max}`)
  }

  if (charset !== undefined) {
    if (typeof charset !== 'string') {
      throw new Error('charset must be a string if provided')
    }
    if (charset.length === 0) {
      throw new Error('charset must not be empty')
    }
  }

  const chars = charset || types[type]
  if (!chars) {
    throw new Error(
      `type must be one of: ${Object.keys(types)
        .map((t) => `'${t}'`)
        .join(', ')}`,
    )
  }

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
}

/**
 * Generates an OTP code using alphabetic characters (both lowercase and uppercase).
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeAlpha(length = 4) {
  return generateCode({ length, type: 'alpha' })
}

/**
 * Generates an OTP code using only numeric digits (0-9).
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeDigits(length = 4) {
  return generateCode({ length, type: 'numeric' })
}

/**
 * Generates an OTP code using alphabetic characters and digits.
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeAlphaNumeric(length = 4) {
  return generateCode({ length, type: 'alphanumeric' })
}

/**
 * Generates an OTP code using alphabetic characters, digits, and symbols.
 *
 * @param {number} [length=4] - The desired length of the code.
 * @returns {string} The generated code.
 */
export function generateCodeAlphaNumericSymbols(length = 4) {
  return generateCode({ length, type: 'any' })
}
