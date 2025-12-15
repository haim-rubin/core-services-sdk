import { Context } from '../../util/context.js'
/**
 * Creates a request-scoped logger enriched with contextual metadata.
 *
 * The logger is derived from the provided Pino logger and augmented with:
 * - correlationId (from Context)
 * - client IP (from Context)
 * - user agent (from Context)
 * - operation identifier in the form: "<METHOD> <URL>"
 *
 * Intended to be used per incoming Fastify request, typically at the beginning
 * of a request lifecycle, so all subsequent logs automatically include
 * request-specific context.
 *
 * @param {import('fastify').FastifyRequest} request
 *   The Fastify request object.
 *
 * @param {import('pino').Logger} log
 *   Base Pino logger instance.
 *
 * @returns {import('pino').Logger}
 *   A child Pino logger enriched with request and context metadata.
 *
 * @example
 * const requestLog = createRequestLogger(request, log, Context)
 * requestLog.info('Handling request')
 */

export const createRequestLogger = (request, log) => {
  const { correlationId, ip, userAgent } = Context?.all() || {}

  return log.child({
    ip,
    userAgent,
    correlationId,
    op: `${request.method} ${request?.url || request?.routeOptions?.url || request.raw.url}`,
  })
}
