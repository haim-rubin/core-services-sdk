import httpStatus from 'http-status'

export class HttpError extends Error {
  /** @type {string|undefined} */
  code

  /** @type {number|undefined} */
  httpStatusCode

  /** @type {string|undefined} */
  httpStatusText

  /**
   * @param {object} [error]
   * @param {string} [error.code]
   * @param {string} [error.message]
   * @param {number} [error.httpStatusCode]
   * @param {string} [error.httpStatusText]
   */
  constructor(error = {}) {
    const { code, message, httpStatusCode, httpStatusText } = error

    super(
      message ||
        (httpStatusCode && httpStatus[httpStatusCode]) ||
        code ||
        'Unknown error',
    )

    this.code = code
    this.httpStatusCode = httpStatusCode
    this.httpStatusText =
      httpStatusText || (httpStatusCode && httpStatus[httpStatusCode])

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  static isInstanceOf(instance) {
    return instance instanceof HttpError
  }

  static [Symbol.hasInstance](instance) {
    return (
      instance &&
      typeof instance === 'object' &&
      'message' in instance &&
      'httpStatusCode' in instance &&
      'httpStatusText' in instance
    )
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      httpStatusCode: this.httpStatusCode,
      httpStatusText: this.httpStatusText,
    }
  }

  static FromError(error) {
    const httpError = new HttpError({
      code: error.code || 'UNHANDLED_ERROR',
      message: error.message || 'An unexpected error occurred',
      httpStatusCode: httpStatus.INTERNAL_SERVER_ERROR,
      httpStatusText: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    })

    httpError.stack = error.stack
    return httpError
  }
}
