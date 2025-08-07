import httpStatus from 'http-status'

/**
 * A reusable generic error object representing a server-side failure (HTTP 500).
 * Useful as a fallback error descriptor for unhandled or unexpected failures.
 *
 * @typedef {Object} GeneralError
 * @property {number} httpStatusCode - The HTTP status code (500).
 * @property {string} httpStatusText - The human-readable status text ("Internal Server Error").
 * @property {string} code - An application-specific error code in the format "GENERAL.<StatusText>".
 */

/** @type {GeneralError} */
export const GENERAL_ERROR = {
  httpStatusCode: httpStatus.INTERNAL_SERVER_ERROR,
  httpStatusText: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
  code: `GENERAL.${httpStatus[httpStatus.INTERNAL_SERVER_ERROR]}`,
}
