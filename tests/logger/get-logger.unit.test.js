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
      fatal: vi.fn(),
      trace: vi.fn(),
    }

    const result = getLogger({ logger: mockLogger })
    expect(result).toBe(mockLogger)
  })

  it('returns a pino logger when called with pino options (no logger key)', () => {
    const logger = getLogger({ level: 'warn' })
    expect(typeof logger.info).toBe('function')
    // @ts-ignore
    expect(logger.level).toBe('warn')
  })

  it('passes through all pino options when no logger key is present', () => {
    const logger = getLogger({ level: 'debug', base: { service: 'test-svc' } })
    expect(typeof logger.info).toBe('function')
    // @ts-ignore
    expect(logger.level).toBe('debug')
  })

  it('treats object without logger key as pino options, not dummy logger', () => {
    const result = getLogger({ someOtherKey: 123 })
    // Should be a real pino logger, not the dummy logger
    expect(typeof result.info).toBe('function')
    // @ts-ignore — pino loggers have a level property
    expect(result.level).toBeDefined()
  })

  it('returns the dummy logger when logger key is present but invalid', () => {
    const invalidLogger = { info: () => {}, warn: () => {} } // missing required methods
    const logger = getLogger({ logger: invalidLogger })

    expect(logger.info).toBeDefined()
    // dummy logger methods are no-ops
    expect(() => logger.info('hello')).not.toThrow()
    // @ts-ignore
    expect(logger.info()).toBeUndefined()
  })

  it('returns the dummy logger for non-object, non-boolean values', () => {
    // @ts-ignore — testing fallback
    const logger = getLogger('invalid')
    expect(logger.info).toBeDefined()
    // @ts-ignore
    expect(logger.info()).toBeUndefined()
  })

  it('logs a message when using internal pino with level warn', () => {
    const logger = getLogger({ logger: true, level: 'warn' })
    // @ts-ignore
    expect(logger.level).toBe('warn')
  })
})
