import { describe, it, expect, vi } from 'vitest'
import { getLogger } from '../../src/logger/get-logger.js'

describe('getLogger', () => {
  it('returns a default pino logger when called with undefined', () => {
    const logger = getLogger(undefined)
    expect(typeof logger.info).toBe('function')
    // @ts-ignore
    expect(logger.level).toBe('info')
  })

  it('returns a default pino logger when called with true', () => {
    const logger = getLogger(true)
    expect(typeof logger.info).toBe('function')
    // @ts-ignore
    expect(logger.level).toBe('info')
  })

  it('returns a pino logger when called with { logger: true } and optional level', () => {
    const logger = getLogger({ logger: true, level: 'debug' })
    expect(typeof logger.debug).toBe('function')
    // @ts-ignore
    expect(logger.level).toBe('debug')
  })

  it('returns the custom logger when provided and valid', () => {
    const mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    }

    const result = getLogger({ logger: mockLogger })
    expect(result).toBe(mockLogger)
  })

  it('returns the dummy logger when logger is invalid', () => {
    const invalidLogger = { info: () => {}, warn: () => {} } // missing 'error' and 'debug'
    const logger = getLogger({ logger: invalidLogger })

    expect(logger.info).toBeDefined()
    expect(logger.warn).toBeDefined()
    expect(logger.error).toBeDefined()
    expect(logger.debug).toBeDefined()

    // Check that it's the dummy logger (no-op)
    expect(() => logger.info('hello')).not.toThrow()
    // @ts-ignore
    expect(logger.info()).toBeUndefined()
  })

  it('returns the dummy logger when called with invalid object', () => {
    const result = getLogger({ someOtherKey: 123 })
    expect(result.info).toBeDefined()
    expect(result.warn).toBeDefined()
  })

  it('logs a message when using internal pino', () => {
    const logger = getLogger({ logger: true, level: 'warn' })
    // @ts-ignore
    expect(logger.level).toBe('warn')
  })
})
