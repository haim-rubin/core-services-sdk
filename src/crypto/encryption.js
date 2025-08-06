import { encrypt, getSaltHex } from './crypto.js'

/**
 * Encrypts a plain-text password using scrypt and a salt.
 *
 * This function generates a random salt (in hex) of the specified length,
 * appends an optional passwordPrivateKey (if provided),
 * and uses the Node.js `crypto.scrypt` algorithm to encrypt the password.
 *
 * @async
 * @function encryptPassword
 *
 * @param {Object} input - The input object containing the password.
 * @param {string} input.password - The plain-text password to encrypt.
 *
 * @param {Object} options - Configuration options for encryption.
 * @param {number} options.saltLength - The desired length of the generated salt (in bytes).
 * @param {string} [options.passwordPrivateKey] - An optional private key to strengthen the salt.
 *
 * @returns {Promise<Object>} An object containing:
 * - `salt` {string} The generated salt in hex format.
 * - `password` {string} The encrypted password in hex format.
 *
 * @example
 * const result = await encryptPassword(
 *   { password: 'mySecretPassword' },
 *   { saltLength: 16, passwordPrivateKey: 'abc123' }
 * );
 * console.log(result); // { salt: 'f3ab...', password: '8e1f...' }
 */

export const encryptPassword = async (
  { password },
  { saltLength, passwordPrivateKey },
) => {
  const salt = getSaltHex(saltLength)

  const encrypted = await encrypt({
    salt,
    passwordPrivateKey,
    expression: password,
  })

  return {
    salt,
    password: encrypted,
  }
}
