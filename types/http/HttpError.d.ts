/**
 * Represents a custom HTTP error with optional status code, status text, error code, and extra metadata.
 * Useful for consistent error handling across services.
 */
export class HttpError extends Error {
  /**
   * Checks if a given object is an instance of `HttpError`.
   *
   * @param {*} instance - The object to check.
   * @returns {boolean} True if `instance` is an instance of `HttpError`.
   */
  static isInstanceOf(instance: any): boolean
  /**
   * Checks if the error is an instance of `HttpError` or has similar shape.
   *
   * @param {object} error
   * @returns {error is HttpError}
   */
  static isHttpError(error: object): error is HttpError
  /**
   * Creates an HttpError from a generic Error instance or returns it if already an HttpError.
   *
   * @param {Error | HttpError} error
   * @returns {HttpError}
   */
  static FromError(error: Error | HttpError): HttpError
  /**
   * Creates an instance of HttpError.
   *
   * @param {Object} [error] - Optional error object.
   * @param {string | number} [error.code] - Application-specific error code.
   * @param {string} [error.message] - Custom error message.
   * @param {number} [error.status] - HTTP status code (e.g., 404, 500).
   * @param {object} [error.extendInfo] - Optional extended metadata for diagnostics.
   */
  constructor(error?: {
    code?: string | number
    message?: string
    status?: number

    extendInfo?: object
  })
  /**
   * @type {string | number | undefined}
   * A short application-specific error code (e.g., "INVALID_INPUT" or a numeric code).
   */
  code: string | number | undefined
  /**
   * @type {number | undefined}
   * HTTP status code associated with the error (e.g., 400, 500).
   */
  httpStatusCode: number | undefined
  /**
   * @type {string | undefined}
   * Human-readable HTTP status text (e.g., "Bad Request").
   */
  extendInfo: object | undefined
  /**
   * Converts the error to a plain object (useful for logging or sending as JSON).
   *
   * @returns {{
   *   code: string | number | undefined,
   *   message: string,
   *   status: number | undefined,
   *   extendInfo?: object
   * }}
   */
  toJSON(): {
    code: string | number | undefined
    message: string
    status: number | undefined
    extendInfo?: object
  }
}
