import { describe, it, expect } from 'vitest'
import { validateEnvForConsole } from '../../src/env/env-validation.js'

describe('validateEnvForConsole', () => {
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

  const mask = () => '****'

  it('returns a printable table with all variables and OK notes when valid', () => {
    const values = {
      PORT: '3000',
      MODE: 'development',
      API_KEY: 'secret',
    }

    const result = validateEnvForConsole(definition, values, { mask })

    expect(result.success).toBe(true)
    expect(typeof result.output).toBe('string')

    // header
    expect(result.output).toContain('Environment variables')
    expect(result.output).toContain('STATUS')
    expect(result.output).toContain('KEY')
    expect(result.output).toContain('VALUE')
    expect(result.output).toContain('NOTES')

    // rows
    expect(result.output).toContain('PORT')
    expect(result.output).toContain('MODE')
    expect(result.output).toContain('API_KEY')

    // notes always present
    expect(result.output).toContain('OK      PORT')
    expect(result.output).toContain('OK      MODE')
    expect(result.output).toContain('OK      API_KEY')

    // masking
    expect(result.output).toContain('****')
    expect(result.output).not.toContain('secret')
  })

  it('returns a printable table with ERROR notes when invalid', () => {
    const values = {
      PORT: '0',
      MODE: 'prod',
      API_KEY: 'secret',
    }

    const result = validateEnvForConsole(definition, values, { mask })

    expect(result.success).toBe(false)
    expect(typeof result.output).toBe('string')

    // all variables still appear
    expect(result.output).toContain('PORT')
    expect(result.output).toContain('MODE')
    expect(result.output).toContain('API_KEY')

    // error rows
    expect(result.output).toContain('ERROR   PORT')
    expect(result.output).toContain('ERROR   MODE')

    // notes are NOT empty
    expect(result.output).toMatch(/PORT\s+0\s+.+/)
    expect(result.output).toMatch(/MODE\s+prod\s+.+/)

    // summary line
    expect(result.output).toContain('Some variables are invalid.')
  })

  it('always sets NOTES to OK for valid variables even if others fail', () => {
    const values = {
      PORT: '3000',
      MODE: 'prod', // invalid
      API_KEY: 'secret',
    }

    const result = validateEnvForConsole(definition, values, { mask })

    // PORT and API_KEY are valid → NOTES = OK
    expect(result.output).toMatch(/OK\s+PORT\s+3000\s+OK/)
    expect(result.output).toMatch(/OK\s+API_KEY\s+\*\*\*\*\s+OK/)

    // MODE is invalid → NOTES = error message
    expect(result.output).toMatch(/ERROR\s+MODE\s+prod\s+.+/)
  })

  it('always returns output even if multiple errors exist', () => {
    const values = {
      MODE: 'prod',
    }

    const result = validateEnvForConsole(definition, values)

    expect(result.success).toBe(false)
    expect(typeof result.output).toBe('string')
    expect(result.output.length).toBeGreaterThan(0)

    // all keys still listed
    expect(result.output).toContain('PORT')
    expect(result.output).toContain('MODE')
    expect(result.output).toContain('API_KEY')
  })
})
