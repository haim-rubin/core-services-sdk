// @ts-nocheck
import { prepareEnvValidation } from '../../src/env/env-validation.js'

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

const scenarios = [
  {
    title: '✅ All valid values',
    values: {
      PORT: 3000,
      TIMEOUT: 500,
      DEBUG: false,
      MODE: 'development',
      API_KEY: 'secret123',
    },
  },
  {
    title: '❌ Invalid port',
    values: {
      PORT: 0,
      TIMEOUT: 500,
      MODE: 'production',
    },
  },
  {
    title: '❌ Invalid enum',
    values: {
      PORT: 3000,
      TIMEOUT: 500,
      MODE: 'prod',
      API_KEY: 'secret123',
    },
  },
]

for (const scenario of scenarios) {
  console.log('\n===================================================')
  console.log(scenario.title)
  console.log('===================================================\n')

  const result = prepareEnvValidation(definition, scenario.values, { mask })

  console.log(result.table)

  if (!result.success) {
    console.log('⚠️  Scenario failed validation')
  }
}
