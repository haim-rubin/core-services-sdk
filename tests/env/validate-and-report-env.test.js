import { describe, it, expect } from 'vitest'
import { validateAndReportEnv } from '../../src/env/env-validation.js'

describe('validateAndReportEnv', () => {
  const schema = {
    FOO: {
      type: 'string',
      required: true,
    },
    BAR: {
      type: 'number',
      required: true,
      int: true,
    },
    SECRET: {
      type: 'string',
      required: true,
      secret: true,
    },
    OPTIONAL: {
      type: 'string',
      required: false,
      default: 'hello',
    },
  }

  it('returns success result when all variables are valid', () => {
    const env = {
      FOO: 'test',
      BAR: '42',
      SECRET: 'super-secret',
    }

    const result = validateAndReportEnv(schema, env)

    expect(result.success).toBe(true)

    expect(result.validation.success).toBe(true)
    expect(result.validation.data).toEqual({
      FOO: 'test',
      BAR: 42,
      SECRET: 'super-secret',
      OPTIONAL: 'hello',
    })

    expect(result.report.success).toBe(true)
    expect(result.report.params).toHaveLength(4)

    expect(result.output).toContain('Environment variables')
    expect(result.output).toContain('OK')
  })

  it('returns failure result when required variable is missing', () => {
    const env = {
      BAR: '10',
      SECRET: 'x',
    }

    const result = validateAndReportEnv(schema, env)

    expect(result.success).toBe(false)

    expect(result.validation.success).toBe(false)
    expect(result.validation.summary).toHaveProperty('FOO')

    const fooParam = result.report.params.find((p) => p.key === 'FOO')
    expect(fooParam.valid).toBe(false)
    expect(fooParam.errors.length).toBeGreaterThan(0)

    expect(result.output).toContain('ERROR')
    expect(result.output).toContain('FOO')
  })

  it('masks secret values in output', () => {
    const env = {
      FOO: 'test',
      BAR: '1',
      SECRET: 'dont-print-me',
    }

    const mask = () => '***'

    const result = validateAndReportEnv(schema, env, { mask })

    const secretParam = result.report.params.find((p) => p.key === 'SECRET')

    expect(secretParam.displayValue).toBe('***')
    expect(result.output).toContain('***')
    expect(result.output).not.toContain('dont-print-me')
  })

  it('coerces and validates types correctly', () => {
    const env = {
      FOO: 'abc',
      BAR: '5',
      SECRET: 'x',
    }

    const result = validateAndReportEnv(schema, env)

    expect(result.success).toBe(true)
    expect(result.validation.data.BAR).toBe(5)
  })
})
