export function createRequestLogger(
  request: import('fastify').FastifyRequest,
  log: import('pino').Logger,
): import('pino').Logger
