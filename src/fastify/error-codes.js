import httpStatus from 'http-status'

/**
 * A reusable generic error object representing a server-side failure (HTTP 500).
 * Useful as a fallback error descriptor for unhandled or unexpected failures.
 *
 * @typedef {Object} GeneralError
 * @property {number} status - The HTTP status code (500).
 * @property {string} code - An application-specific error code in the format "GENERAL.<StatusText>".
 */

/** @type {GeneralError} */
export const GENERAL_ERROR = {
  status: httpStatus.INTERNAL_SERVER_ERROR,
  code: `GENERAL.${httpStatus[httpStatus.INTERNAL_SERVER_ERROR]}`,
}
