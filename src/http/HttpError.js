import * as httpStatus from 'http-status'

const DEFAULT_ERROR = {
  httpStatusCode: httpStatus.INTERNAL_SERVER_ERROR,
  code: 'UNKNOWN',
  httpStatusText: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
}

/**
 *
 */
export class HttpError extends Error {
  /** @type {number} */
  httpStatusCode
  /** @type {string} */
  code
  /** @type {string} */
  httpStatusText

  /** @type {Array} */
  details
  constructor({
    httpStatusCode,
    code,
    httpStatusText,
    details = [],
  } = DEFAULT_ERROR) {
    super(`${code || httpStatus[httpStatusCode]}`)
    this.httpStatusCode = httpStatusCode
    this.code = code
    this.httpStatusText = httpStatusText
    this.details = details

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   *
   * @param {object} instance
   * @returns {boolean}
   */
  static isInstanceOf(instance) {
    return instance instanceof HttpError
  }
}
