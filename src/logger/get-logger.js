import pino from 'pino'

const requiredMethods = ['info', 'warn', 'error', 'debug', 'fatal', 'trace']

const dummyLogger = {
  info: () => {},
  warn: () => {},
  trace: () => {},
  debug: () => {},
  error: () => {},
  fatal: () => {},
  levels: () => {},
  silent: () => {},
  child() {
    return this
  },
}

/**
 * @param {any} logger
 * @returns {boolean}
 */
const isValidLogger = (logger) =>
  typeof logger === 'object' &&
  requiredMethods.every((method) => typeof logger[method] === 'function')

/**
 * Creates or returns a logger instance based on user-provided options.
 *
 * Supported usages:
 * - `undefined` → pino with level 'info'
 * - `true` → pino with level 'info'
 * - `{ logger: true, level?: string }` → pino with given level
 * - `{ logger: LoggerObject }` → use provided logger
 * - fallback → dummy logger
 *
 * @param {true | Object | undefined} option
 * @returns {import('pino').Logger | typeof dummyLogger}
 */
export const getLogger = (option) => {
  // No option provided or just true: use pino default
  if (option === undefined || option === true) {
    const logger = pino({ level: 'info' })
    logger.info(
      '[getLogger] No logger config provided. Using default Pino logger (level: info).',
    )
    return logger
  }

  // Option object provided
  if (typeof option === 'object') {
    const { logger, level } = option

    // User asked for internal pino with level
    if (logger === true) {
      const pinoLogger = pino({ level: level || 'info' })
      pinoLogger.info(
        `[getLogger] Using internal Pino logger (level: ${level || 'info'}).`,
      )
      return pinoLogger
    }

    // User supplied a custom logger
    if (isValidLogger(logger)) {
      return logger
    }
  }

  // Invalid or no-op fallback
  return dummyLogger
}
