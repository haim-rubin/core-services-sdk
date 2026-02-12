import { describe, it, expect } from 'vitest'
import { prepareEnvValidation } from '../../src/env/env-validation.js'

describe('prepareEnvValidation', () => {
  const mask = () => '****'

  const definition = {
    PORT: {
      type: 'number',
      required: true,
      int: true,
      min: 1,
      max: 65535,
    },
    MODE: {
      type: 'string',
      enum: ['development', 'production'],
      required: true,
    },
    API_KEY: {
      type: 'string',
      secret: true,
    },
  }

  it('returns success and a printable table when values are valid', () => {
    const values = {
      PORT: '3000',
      MODE: 'development',
      API_KEY: 'secret',
    }

    const result = prepareEnvValidation(definition, values, { mask })

    expect(result.success).toBe(true)
    expect(result.table).toContain('Environment variables')
    expect(result.table).toContain('PORT')
    expect(result.table).toContain('OK')
    expect(result.table).toContain('****')
    expect(result.table).not.toContain('secret')
  })

  it('returns failure and error table when required value is missing', () => {
    const values = {
      MODE: 'production',
    }

    const result = prepareEnvValidation(definition, values)

    expect(result.success).toBe(false)
    expect(result.validation.success).toBe(false)

    expect(result.table).toContain('ERROR')
    expect(result.table).toContain('PORT')
  })

  it('coerces number values correctly', () => {
    const values = {
      PORT: '8080',
      MODE: 'production',
      API_KEY: 'x',
    }

    const result = prepareEnvValidation(definition, values)

    expect(result.success).toBe(true)
    // @ts-ignore
    expect(result.validation.data.PORT).toBe(8080)
  })

  it('returns a table string even on failure', () => {
    const values = {
      PORT: 0,
      MODE: 'development',
    }

    const result = prepareEnvValidation(definition, values)

    expect(typeof result.table).toBe('string')
    expect(result.table.length).toBeGreaterThan(0)
  })
})
