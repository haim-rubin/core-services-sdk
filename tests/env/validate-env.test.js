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
