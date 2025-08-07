import httpStatus from 'http-status'

/**
 * Represents a custom HTTP error with optional status code, status text, error code, and extra metadata.
 * Useful for consistent error handling across services.
 */
export class HttpError extends Error {
  /**
   * @type {string | number | undefined}
   * A short application-specific error code (e.g., "INVALID_INPUT" or a numeric code).
   */
  code

  /**
   * @type {number | undefined}
   * HTTP status code associated with the error (e.g., 400, 500).
   */
  httpStatusCode

  /**
   * @type {string | undefined}
   * Human-readable HTTP status text (e.g., "Bad Request").
   */
  httpStatusText

  /**
   * @type {object | undefined}
   * Optional metadata for debugging/logging (e.g., request ID, user ID, retryAfter).
   */
  extendInfo

  /**
   * Creates an instance of HttpError.
   *
   * @param {Object} [error] - Optional error object.
   * @param {string | number} [error.code] - Application-specific error code.
   * @param {string} [error.message] - Custom error message.
   * @param {number} [error.httpStatusCode] - HTTP status code (e.g., 404, 500).
   * @param {string} [error.httpStatusText] - Optional human-readable HTTP status text.
   * @param {object} [error.extendInfo] - Optional extended metadata for diagnostics.
   */
  constructor(error = {}) {
    const { code, message, httpStatusCode, httpStatusText, extendInfo } = error

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
    this.extendInfo = extendInfo

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Checks if a given object is an instance of `HttpError`.
   *
   * @param {*} instance - The object to check.
   * @returns {boolean} True if `instance` is an instance of `HttpError`.
   */
  static isInstanceOf(instance) {
    return instance instanceof HttpError
  }

  /**
   * Custom implementation for `instanceof` checks.
   *
   * @param {*} instance - The object to check.
   * @returns {boolean} True if it has HttpError-like structure.
   */
  static [Symbol.hasInstance](instance) {
    return (
      instance &&
      typeof instance === 'object' &&
      'message' in instance &&
      'httpStatusCode' in instance &&
      'httpStatusText' in instance
    )
  }

  /**
   * Converts the error to a plain object (useful for logging or sending as JSON).
   *
   * @returns {{
   *   code: string | number | undefined,
   *   message: string,
   *   httpStatusCode: number | undefined,
   *   httpStatusText: string | undefined,
   *   extendInfo?: object
   * }}
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      httpStatusCode: this.httpStatusCode,
      httpStatusText: this.httpStatusText,
      ...(this.extendInfo ? { extendInfo: this.extendInfo } : {}),
    }
  }

  /**
   * Checks if the error is an instance of `HttpError` or has similar shape.
   *
   * @param {object} error
   * @returns {error is HttpError}
   */
  static isHttpError(error) {
    return (
      error instanceof HttpError ||
      (error &&
        typeof error === 'object' &&
        'httpStatusCode' in error &&
        'httpStatusText' in error &&
        'toJSON' in error)
    )
  }

  /**
   * Creates an HttpError from a generic Error instance or returns it if already an HttpError.
   *
   * @param {Error | HttpError} error
   * @returns {HttpError}
   */
  static FromError(error) {
    if (HttpError.isHttpError(error)) {
      return error
    }

    const httpError = new HttpError({
      code: 'UNHANDLED_ERROR',
      message: error.message || 'An unexpected error occurred',
      httpStatusCode: httpStatus.INTERNAL_SERVER_ERROR,
      httpStatusText: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    })

    httpError.stack = error.stack
    return httpError
  }
}
