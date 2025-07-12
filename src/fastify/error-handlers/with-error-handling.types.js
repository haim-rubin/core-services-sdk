/**
 * @typedef {object} Reply
 * @property {(code: number) => Reply} status - Sets the HTTP status code
 * @property {(payload: any) => void} send - Sends the response
 */

/**
 * @typedef {object} Logger
 * @property {(message: string, ...args: any[]) => void} error - Logs an error message
 */
