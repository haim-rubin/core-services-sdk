/**
 * A reusable generic error object representing a server-side failure (HTTP 500).
 * Useful as a fallback error descriptor for unhandled or unexpected failures.
 *
 * @typedef {Object} GeneralError
 * @property {number} status - The HTTP status code (500).
 * @property {string} code - An application-specific error code in the format "GENERAL.<StatusText>".
 */
/** @type {GeneralError} */
export const GENERAL_ERROR: GeneralError
/**
 * A reusable generic error object representing a server-side failure (HTTP 500).
 * Useful as a fallback error descriptor for unhandled or unexpected failures.
 */
export type GeneralError = {
  /**
   * - The HTTP status code (500).
   */
  status: number
  /**
   * - An application-specific error code in the format "GENERAL.<StatusText>".
   */
  code: string
}
