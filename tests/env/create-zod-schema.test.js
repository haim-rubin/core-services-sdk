import { describe, it, expect } from 'vitest'
import { z } from 'zod'

import { createZodSchema } from '../../src/env/env-validation.js'

describe('createZodSchema', () => {
  it('creates a Zod object schema from definition', () => {
    const definition = {
      PORT: { type: 'number', required: true },
      DEBUG: { type: 'boolean' },
    }

    const schema = createZodSchema(definition)

    expect(schema).toBeInstanceOf(z.ZodObject)
  })

  it('parses valid values successfully', () => {
    const definition = {
      PORT: { type: 'number', required: true, min: 1 },
      DEBUG: { type: 'boolean', default: false },
    }

    const schema = createZodSchema(definition)

    const result = schema.parse({
      PORT: '3000',
    })

    expect(result).toEqual({
      PORT: 3000,
      DEBUG: false,
    })
  })

  it('throws error when required field is missing', () => {
    const definition = {
      PORT: { type: 'number', required: true },
      DEBUG: { type: 'boolean' },
    }

    const schema = createZodSchema(definition)

    expect(() => {
      schema.parse({
        DEBUG: true,
      })
    }).toThrow()
  })

  it('allows optional fields to be missing', () => {
    const definition = {
      PORT: { type: 'number', required: true },
      DEBUG: { type: 'boolean' },
    }

    const schema = createZodSchema(definition)

    const result = schema.parse({
      PORT: 8080,
    })

    expect(result).toEqual({
      PORT: 8080,
    })
  })

  it('applies string constraints correctly', () => {
    const definition = {
      NODE_ENV: {
        type: 'string',
        required: true,
        enum: ['development', 'production'],
      },
    }

    const schema = createZodSchema(definition)

    expect(() => {
      schema.parse({ NODE_ENV: 'prod' })
    }).toThrow()

    const result = schema.parse({ NODE_ENV: 'production' })
    expect(result.NODE_ENV).toBe('production')
  })

  it('applies number constraints correctly', () => {
    const definition = {
      PORT: {
        type: 'number',
        required: true,
        int: true,
        min: 1,
        max: 65535,
      },
    }

    const schema = createZodSchema(definition)

    expect(() => {
      schema.parse({ PORT: 0 })
    }).toThrow()

    expect(() => {
      schema.parse({ PORT: 70000 })
    }).toThrow()

    const result = schema.parse({ PORT: '3000' })
    expect(result.PORT).toBe(3000)
  })

  it('validates string formats', () => {
    const definition = {
      DATABASE_URL: {
        type: 'string',
        required: true,
        format: 'url',
      },
    }

    const schema = createZodSchema(definition)

    expect(() => {
      schema.parse({ DATABASE_URL: 'not-a-url' })
    }).toThrow()

    const result = schema.parse({
      DATABASE_URL: 'https://example.com',
    })

    expect(result.DATABASE_URL).toBe('https://example.com')
  })

  it('collects multiple validation errors', () => {
    const definition = {
      PORT: { type: 'number', required: true, min: 1 },
      NODE_ENV: {
        type: 'string',
        required: true,
        enum: ['development', 'production'],
      },
    }

    const schema = createZodSchema(definition)

    try {
      schema.parse({
        PORT: 0,
        NODE_ENV: 'prod',
      })
    } catch (error) {
      // @ts-ignore
      expect(error.issues).toHaveLength(2)

      // @ts-ignore
      const paths = error.issues.map((i) => i.path[0])
      expect(paths).toContain('PORT')
      expect(paths).toContain('NODE_ENV')
    }
  })

  it('coerces boolean values correctly', () => {
    const definition = {
      DEBUG: { type: 'boolean', required: true },
    }

    const schema = createZodSchema(definition)

    const result = schema.parse({
      DEBUG: 'true',
    })

    expect(result.DEBUG).toBe(true)
  })
})
