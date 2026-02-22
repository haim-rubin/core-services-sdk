// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { buildEnvReport } from '../../src/env/env-validation.js'

const mask = (v) => `***${String(v).slice(-2)}`

describe('buildEnvReport', () => {
  it('builds report for successful validation', () => {
    const definition = {
      PORT: { type: 'number' },
      API_KEY: { type: 'string', secret: true },
      DEBUG: { type: 'boolean' },
    }

    const values = {
      PORT: 3000,
      API_KEY: 'secret123',
      DEBUG: false,
    }

    const validationResult = {
      success: true,
      data: values,
    }

    const report = buildEnvReport(definition, values, validationResult, mask)

    expect(report.success).toBe(true)
    expect(report.params).toHaveLength(3)

    const apiKey = report.params.find((p) => p.key === 'API_KEY')
    expect(apiKey.secret).toBe(true)
    expect(apiKey.displayValue).toBe('***23')
    expect(apiKey.valid).toBe(true)
  })

  it('builds report for failed validation with errors', () => {
    const definition = {
      PORT: { type: 'number' },
      DEBUG: { type: 'boolean' },
    }

    const values = {
      PORT: 0,
      DEBUG: false,
    }

    const validationResult = {
      success: false,
      summary: {
        PORT: ['Invalid number'],
      },
    }

    const report = buildEnvReport(definition, values, validationResult, mask)

    expect(report.success).toBe(false)

    const port = report.params.find((p) => p.key === 'PORT')
    expect(port.valid).toBe(false)
    expect(port.errors).toEqual(['Invalid number'])
    expect(port.displayValue).toBe('0')
  })

  it('marks parameter as invalid when errors exist', () => {
    const definition = {
      PORT: { type: 'number' },
    }

    const values = {
      PORT: 'x',
    }

    const validationResult = {
      success: false,
      summary: {
        PORT: ['Invalid number'],
      },
    }

    const report = buildEnvReport(definition, values, validationResult, mask)

    const port = report.params[0]
    expect(port.valid).toBe(false)
    expect(port.errors).toEqual(['Invalid number'])
  })

  it('uses defaultMask when mask is not a function', () => {
    const definition = {
      API_KEY: { type: 'string', secret: true },
    }

    const values = {
      API_KEY: 'secret123',
    }

    const validationResult = {
      success: true,
      data: values,
    }

    const report = buildEnvReport(definition, values, validationResult, null)

    const apiKey = report.params[0]
    expect(apiKey.secret).toBe(true)
    expect(typeof apiKey.displayValue).toBe('string')
    expect(apiKey.displayValue).not.toBe('secret123')
  })

  it('keeps params order as definition order', () => {
    const definition = {
      A: { type: 'string' },
      B: { type: 'string' },
      C: { type: 'string' },
    }

    const values = {
      A: '1',
      B: '2',
      C: '3',
    }

    const validationResult = {
      success: true,
      data: values,
    }

    const report = buildEnvReport(definition, values, validationResult, mask)

    expect(report.params.map((p) => p.key)).toEqual(['A', 'B', 'C'])
  })
})
