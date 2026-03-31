import { describe, it, expect } from 'vitest'
import { validateEnv } from '../../src/env/env-validation.js'

describe('validateEnv', () => {
  it('returns success result when values are valid', () => {
    const definition = {
      PORT: { type: 'number', required: true, min: 1 },
      DEBUG: { type: 'boolean', default: false },
    }

    const values = {
      PORT: '3000',
    }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    // @ts-ignore
    expect(result.data).toEqual({
      PORT: 3000,
      DEBUG: false,
    })
  })

  it('returns error result with summary when required field is missing', () => {
    const definition = {
      PORT: { type: 'number', required: true },
      DEBUG: { type: 'boolean' },
    }

    const values = {
      DEBUG: true,
    }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(false)
    // @ts-ignore
    expect(result.summary).toBeDefined()
    // @ts-ignore
    expect(result.summary).toHaveProperty('PORT')
    // @ts-ignore
    expect(result.summary.PORT.length).toBeGreaterThan(0)
  })

  it('returns summary with errors for the field when value is invalid', () => {
    const definition = {
      PORT: {
        type: 'number',
        required: true,
        int: true,
        min: 10,
      },
    }

    const values = {
      PORT: '5.5',
    }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(false)
    // @ts-ignore
    expect(result.summary).toHaveProperty('PORT')
    // @ts-ignore
    expect(result.summary.PORT.length).toBeGreaterThan(0)
  })

  it('returns summary with errors from multiple fields', () => {
    const definition = {
      PORT: { type: 'number', required: true, min: 1 },
      NODE_ENV: {
        type: 'string',
        required: true,
        enum: ['development', 'production'],
      },
    }

    const values = {
      PORT: 0,
      NODE_ENV: 'prod',
    }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(false)
    // @ts-ignore
    expect(result.summary).toHaveProperty('PORT')
    // @ts-ignore
    expect(result.summary).toHaveProperty('NODE_ENV')
  })

  it('always returns data even when validation fails', () => {
    const definition = {
      PORT: { type: 'number', default: 3000 },
      HOST: { type: 'string', format: 'url' },
    }

    const values = {
      HOST: 'invalid-url',
    }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(false)
    expect(result.data).toBeDefined()
    expect(result.data.PORT).toBe(3000)
    expect(result.data.HOST).toBe('invalid-url')
    expect(result.summary).toHaveProperty('HOST')
  })

  it('applies default when value is undefined', () => {
    const definition = {
      PORT: { type: 'number', default: 3000 },
      DEBUG: { type: 'boolean', default: false },
    }

    const values = {}

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    expect(result.data.PORT).toBe(3000)
    expect(result.data.DEBUG).toBe(false)
  })

  it('does not replace existing value with default', () => {
    const definition = {
      PORT: { type: 'number', default: 3000 },
    }

    const values = { PORT: '8080' }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    expect(result.data.PORT).toBe(8080)
  })

  it('does not replace invalid value with default', () => {
    const definition = {
      PORT: { type: 'number', min: 1, default: 3000 },
    }

    const values = { PORT: 'not-a-number' }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(false)
    expect(result.data.PORT).toBe('not-a-number')
    expect(result.summary).toHaveProperty('PORT')
  })

  it('parses boolean string "false" to false', () => {
    const definition = {
      ENABLED: { type: 'boolean' },
    }

    const values = { ENABLED: 'false' }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    expect(result.data.ENABLED).toBe(false)
  })

  it('parses boolean string "true" to true', () => {
    const definition = {
      ENABLED: { type: 'boolean' },
    }

    const values = { ENABLED: 'true' }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    expect(result.data.ENABLED).toBe(true)
  })

  it('parses boolean string "1" to true and "0" to false', () => {
    const definition = {
      A: { type: 'boolean' },
      B: { type: 'boolean' },
    }

    const values = { A: '1', B: '0' }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    expect(result.data.A).toBe(true)
    expect(result.data.B).toBe(false)
  })

  it('parses boolean default string "false" to false', () => {
    const definition = {
      DIGITAL_SIGNING_ENABLED: { type: 'boolean', default: 'false' },
    }

    const values = {}

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    expect(result.data.DIGITAL_SIGNING_ENABLED).toBe(false)
  })

  it('does not include summary when validation succeeds', () => {
    const definition = {
      PORT: { type: 'number', required: true },
    }

    const values = {
      PORT: 8080,
    }

    const result = validateEnv(definition, values)

    expect(result.success).toBe(true)
    // @ts-ignore
    expect(result.summary).toBeUndefined()
  })
})
