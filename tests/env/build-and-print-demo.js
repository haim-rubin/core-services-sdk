// @ts-nocheck
import { validateAndReportEnv } from '../../src/env/env-validation.js'

// mask example
const mask = (value) => {
  if (value == null) {
    return '******'
  }

  const str = String(value)
  if (str.length <= 4) {
    return '****'
  }

  return `${str.slice(0, 2)}****${str.slice(-2)}`
}

/**
 * Definitions
 */
const definition = {
  PORT: {
    type: 'number',
    required: true,
    int: true,
    min: 1,
    max: 65535,
  },

  TIMEOUT: {
    type: 'number',
    min: 100,
    max: 10000,
  },

  RETRIES: {
    type: 'number',
    int: true,
    min: 0,
  },

  DEBUG: {
    type: 'boolean',
  },

  MODE: {
    type: 'string',
    enum: ['development', 'production'],
  },

  API_KEY: {
    type: 'string',
    secret: true,
  },
}

/**
 * Values scenarios
 */
const scenarios = [
  {
    title: '✅ All valid values',
    values: {
      PORT: 3000,
      TIMEOUT: 500,
      RETRIES: 3,
      DEBUG: false,
      MODE: 'development',
      API_KEY: 'secret123',
    },
  },
  {
    title: '❌ Number too small (PORT)',
    values: {
      PORT: 0,
      TIMEOUT: 500,
      RETRIES: 3,
      DEBUG: true,
      MODE: 'production',
      API_KEY: 'secret123',
    },
  },
  {
    title: '❌ Number too large (TIMEOUT)',
    values: {
      PORT: 3000,
      TIMEOUT: 20000,
      RETRIES: 1,
      DEBUG: false,
      MODE: 'development',
      API_KEY: 'secret123',
    },
  },
  {
    title: '❌ Invalid number (string)',
    values: {
      PORT: 'abc',
      TIMEOUT: 500,
      RETRIES: 2,
      DEBUG: false,
      MODE: 'development',
      API_KEY: 'secret123',
    },
  },
  {
    title: '❌ Invalid enum (MODE)',
    values: {
      PORT: 3000,
      TIMEOUT: 500,
      RETRIES: 2,
      DEBUG: false,
      MODE: 'prod',
      API_KEY: 'secret123',
    },
  },
  {
    title: '✅ Boolean coercion + missing secret',
    values: {
      PORT: '8080',
      TIMEOUT: '1000',
      RETRIES: '0',
      DEBUG: 'true',
      MODE: 'production',
    },
  },
]

/**
 * Run scenarios
 */
for (const scenario of scenarios) {
  console.log('\n===================================================')
  console.log(scenario.title)
  console.log('===================================================\n')

  const result = validateAndReportEnv(definition, scenario.values, { mask })

  console.log(result.output)
}
