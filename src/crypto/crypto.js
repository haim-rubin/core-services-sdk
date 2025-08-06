import { promisify } from 'util'
import { randomBytes, scrypt } from 'crypto'

const scryptPromisify = promisify(scrypt)

const keyLength = 64
const baseFormat = 'hex'

/**
 * Generates a cryptographically secure random salt as a Buffer.
 *
 * @param {number} length - The length of the salt in bytes.
 * @returns {Buffer} A Buffer containing random bytes.
 *
 * @example
 * const salt = getSalt(16)
 * console.log(salt.toString('hex')) // 'e4b1c9...'
 */
export const getSalt = (length) => {
  return randomBytes(length)
}

/**
 * Generates a cryptographically secure random salt and returns it as a hexadecimal string.
 *
 * @param {number} length - The length of the salt in bytes.
 * @returns {string} The salt encoded as a hexadecimal string.
 *
 * @example
 * const saltHex = getSaltHex(16)
 * console.log(saltHex) // 'e4b1c9...'
 */
export const getSaltHex = (length) => {
  return getSalt(length).toString(baseFormat)
}

/**
 * Encrypts a given expression using scrypt with a provided salt.
 *
 * @param {Object} options - The encryption options.
 * @param {string} options.expression - The expression to encrypt (e.g., a password).
 * @param {string} options.salt - The salt to use (as a string).
 * @param {number} [options.length=64] - The desired key length in bytes for the derived key.
 * @returns {Promise<Buffer>} A Promise that resolves to the derived key as a Buffer.
 *
 * @example
 * const buffer = await getEncryptedBuffer({
 *   expression: 'my-password',
 *   salt: 'somesalt',
 *   length: 32
 * })
 * console.log(buffer.toString('hex'))
 */
export const getEncryptedBuffer = async ({
  salt,
  expression,
  length = keyLength,
}) => {
  const encryptedExpression = await scryptPromisify(expression, salt, length)

  return encryptedExpression
}

/**
 * Encrypts a string expression (e.g., password) using scrypt and returns the result as a hexadecimal string.
 *
 * Optionally appends a `passwordPrivateKey` to the salt for extra security.
 *
 * @param {Object} options
 * @param {string} options.expression - The expression to encrypt.
 * @param {string} options.salt - The salt string.
 * @param {string} [options.passwordPrivateKey] - Optional extra key to enhance the salt.
 * @returns {Promise<string>} A Promise that resolves to the encrypted expression as a hex string.
 *
 * @example
 * const encrypted = await encrypt({
 *   expression: 'my-password',
 *   salt: 'abc123',
 *   passwordPrivateKey: 'my-secret-key'
 * })
 * console.log(encrypted) // '9af0a1b23c...'
 */
export const encrypt = async ({ salt, expression, passwordPrivateKey }) => {
  const encryptedExpression = await getEncryptedBuffer({
    expression,
    salt: `${salt}${passwordPrivateKey ? passwordPrivateKey : ''}`,
  })

  return encryptedExpression.toString(baseFormat)
}

/**
 * Compares a plain-text password to an already encrypted one using scrypt.
 *
 * Re-encrypts the input password using the provided salt and optional private key,
 * then compares it to the stored encrypted password.
 *
 * @param {Object} options
 * @param {string} options.salt - The salt used during encryption.
 * @param {string} options.password - The plain-text password to validate.
 * @param {string} options.encryptedPassword - The previously encrypted password (hex string).
 * @param {string} [options.passwordPrivateKey] - Optional private key used in encryption.
 * @returns {Promise<boolean>} A Promise that resolves to `true` if passwords match, otherwise `false`.
 *
 * @example
 * const isValid = await isPasswordMatch({
 *   password: 'my-password',
 *   salt: 'abc123',
 *   encryptedPassword: '9af0a1b23c...',
 *   passwordPrivateKey: 'my-secret-key'
 * })
 * console.log(isValid) // true or false
 */
export const isPasswordMatch = async ({
  salt,
  password,
  encryptedPassword,
  passwordPrivateKey,
}) => {
  const encryptedCurrentPassword = await getEncryptedBuffer({
    expression: password,
    salt: `${salt}${passwordPrivateKey ? passwordPrivateKey : ''}`,
  })
  const isMatch = encryptedCurrentPassword.equals(
    Buffer.from(encryptedPassword, baseFormat),
  )
  return isMatch
}
