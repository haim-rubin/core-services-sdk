import httpStatus from 'http-status'

import { GENERAL_ERROR } from '../error-codes.js'
import { HttpError } from '../../http/HttpError.js'

/** @typedef {import('fastify').FastifyReply} Reply */
/** @typedef {import('fastify').FastifyRequest} Request */
/** @typedef {import('pino').Logger} Logger */

/**
 * Generic error-handling wrapper that logs and throws a safe error.
 * @param {object} log - Logger with an .error method.
 * @param {HttpError} defaultError - Error to throw if original error is not an HttpError.
 * @returns {(funcToInvoke: () => Promise<any>) => Promise<any>}
 */
export const withErrorHandling =
  (log, defaultError) => async (funcToInvoke) => {
    try {
      return await funcToInvoke()
    } catch (error) {
      log.error(`[withErrorHandling] - Error: ${error?.stack || error}`)

      if (!error) {
        throw defaultError
      }

      if (HttpError.isInstanceOf(error)) {
        throw error
      }

      const httpError = HttpError.FromError(error)

      throw httpError
    }
  }

/**
 * Executes function with error handling and replies on failure.
 *
 * @param {object} params
 * @param {Reply} params.reply - Fastify reply object
 * @param {Logger} params.log - Logger object
 * @param {HttpError} [params.defaultError] - Fallback error
 */
export const withErrorHandlingReply =
  ({ reply, log, defaultError = new HttpError(GENERAL_ERROR) }) =>
  async (funcToInvoke) => {
    try {
      return await withErrorHandling(log, defaultError)(funcToInvoke)
    } catch (error) {
      const { code, httpStatusText, httpStatusCode } = error
      reply.status(httpStatusCode).send({ code, httpStatusText })
    }
  }

/**
 * Executes function with error handling and replies on failure.
 *
 * @param {object} params
 * @param {Reply} params.reply - Fastify reply object
 * @param {Logger} params.log - Logger object
 * @param {HttpError} [params.defaultError] - Fallback error
 */
export const replyOnErrorOnly =
  ({ reply, log, defaultError = new HttpError(GENERAL_ERROR) }) =>
  async (funcToInvoke) => {
    try {
      return await withErrorHandling(log, defaultError)(funcToInvoke)
    } catch (error) {
      log.error(`[replyOnErrorOnly] - Error: ${error?.stack || error}`)
      const isHttp = HttpError.isInstanceOf(error)
      const errorMerged = isHttp
        ? error
        : new HttpError({
            ...defaultError,
            message: error?.message || defaultError.message,
            code: error?.code || defaultError.code,
          })

      if (!isHttp && error?.stack) {
        errorMerged.stack = error.stack
      }

      const exposed =
        errorMerged.message ?? errorMerged.code ?? GENERAL_ERROR.httpStatusText

      const status =
        errorMerged.httpStatusCode && errorMerged.httpStatusCode in httpStatus
          ? errorMerged.httpStatusCode
          : httpStatus.INTERNAL_SERVER_ERROR

      reply.status(status).send({ error: exposed })
    }
  }
