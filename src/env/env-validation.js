import { z } from 'zod'
import { mask as defaultMask } from '../util/mask-sensitive.js'

/**
 * Converts a single field definition into a Zod schema.
 *
 * @param {Object} def
 * @param {'string'|'number'|'boolean'} def.type
 *
 * @param {boolean} [def.required]
 *   Whether the value is required. Defaults to false.
 *
 * @param {*} [def.default]
 *   Default value if the variable is missing.
 *
 * @param {boolean} [def.secret]
 *   Marks the variable as secret (used only for masking/logging).
 *
 * // string options
 * @param {number} [def.minLength]
 * @param {number} [def.maxLength]
 * @param {string} [def.pattern]
 * @param {string[]} [def.enum]
 * @param {'email'|'url'} [def.format]
 *
 * // number options
 * @param {number} [def.min]
 * @param {number} [def.max]
 * @param {boolean} [def.int]
 * @param {boolean} [def.positive]
 * @param {boolean} [def.negative]
 *
 * @returns {import('zod').ZodTypeAny}
 */
export function defToZod(def) {
  let schema

  switch (def.type) {
    case 'string': {
      schema = z.string()

      if (def.minLength !== undefined) {
        schema = schema.min(def.minLength)
      }

      if (def.maxLength !== undefined) {
        schema = schema.max(def.maxLength)
      }

      if (def.pattern) {
        schema = schema.regex(new RegExp(def.pattern))
      }

      if (def.enum) {
        schema = z.enum(def.enum)
      }

      if (def.format === 'email') {
        schema = schema.email()
      }

      if (def.format === 'url') {
        schema = schema.url()
      }

      break
    }

    case 'number': {
      schema = z.coerce.number()

      if (def.int) {
        schema = schema.int()
      }

      if (def.min !== undefined) {
        schema = schema.min(def.min)
      }

      if (def.max !== undefined) {
        schema = schema.max(def.max)
      }

      if (def.positive) {
        schema = schema.positive()
      }

      if (def.negative) {
        schema = schema.negative()
      }

      break
    }

    case 'boolean': {
      schema = z.preprocess((val) => {
        if (val === undefined) {
          return val
        }

        if (typeof val === 'boolean') {
          return val
        }

        if (typeof val === 'string') {
          const normalized = val.toLowerCase().trim()

          if (normalized === 'true') {
            return true
          }
          if (normalized === 'false') {
            return false
          }
          if (normalized === '1') {
            return true
          }
          if (normalized === '0') {
            return false
          }
        }

        return val
      }, z.boolean())

      break
    }

    default: {
      throw new Error(`Unsupported type: ${def.type}`)
    }
  }

  if (def.default !== undefined) {
    schema = schema.default(def.default)
  }

  if (!def.required) {
    schema = schema.optional()
  }

  return schema
}

/**
 * Builds a Zod object schema from a JSON definition map.
 *
 * @param {Record<string, Object>} definition
 *   Map of environment variable names to field definitions.
 *
 * @returns {import('zod').ZodObject<any>}
 */
export function createZodSchema(definition) {
  const shape = Object.entries(definition).reduce((shape, [key, def]) => {
    return {
      ...shape,
      [key]: defToZod(def),
    }
  }, {})

  return z.object(shape)
}

/**
 * Validates values using a JSON definition and Zod.
 *
 * @param {Record<string, Object>} definition
 * @param {Record<string, any>} values
 *
 * @returns {{
 *   success: true,
 *   data: Record<string, any>
 * } | {
 *   success: false,
 *   summary: Record<string, string[]>
 * }}
 */
export function validateEnv(definition, values) {
  const schema = createZodSchema(definition)
  const result = schema.safeParse(values)

  if (result.success) {
    return {
      success: true,
      data: result.data,
    }
  }

  const summary = result.error.issues.reduce((acc, issue) => {
    const key = issue.path[0] || 'root'
    acc[key] = acc[key] || []
    acc[key].push(issue.message)
    return acc
  }, {})

  return {
    success: false,
    summary,
  }
}

/**
 * Builds a structured environment validation report.
 *
 * @param {Record<string, Object>} definition
 * @param {Record<string, any>} values
 *   Raw input values (e.g. process.env)
 *
 * @param {{
 *   success: boolean,
 *   data?: Record<string, any>,
 *   summary?: Record<string, string[]>
 * }} validationResult
 *
 * @param {(value: any) => string} mask
 *
 * @returns {{
 *   success: boolean,
 *   params: Array<{
 *     key: string,
 *     value: any,
 *     displayValue: string,
 *     secret: boolean,
 *     valid: boolean,
 *     errors?: string[]
 *   }>
 * }}
 */
export function buildEnvReport(definition, values, validationResult, mask) {
  const maskValue = typeof mask === 'function' ? mask : defaultMask

  const params = Object.keys(definition).map((key) => {
    const def = definition[key]
    const isSecret = Boolean(def.secret)

    // value precedence:
    // 1. validated & parsed value
    // 2. raw input value
    const rawValue = values[key]
    const value = validationResult.success
      ? validationResult.data[key]
      : rawValue

    const displayValue = isSecret ? maskValue(value) : String(value)

    const errors = validationResult.success
      ? undefined
      : validationResult.summary?.[key]

    return {
      key,
      value,
      displayValue,
      secret: isSecret,
      valid: !errors,
      errors,
    }
  })

  return {
    success: validationResult.success,
    params,
  }
}

/**
 * Formats an environment validation report into a readable table.
 *
 * @param {{
 *   success: boolean,
 *   params: Array<{
 *     key: string,
 *     displayValue: string,
 *     secret: boolean,
 *     valid: boolean,
 *     errors?: string[]
 *   }>
 * }} report
 *
 * @returns {string}
 */
export function formatEnvReport(report) {
  const headers = ['STATUS', 'KEY', 'VALUE', 'NOTES']

  const rows = report.params.map((p) => {
    const status = p.valid ? 'OK' : 'ERROR'
    const notes = p.errors?.join('; ') || ''

    return [status, p.key, p.displayValue, notes]
  })

  const allRows = [headers, ...rows]

  const colWidths = headers.map((_, i) =>
    Math.max(...allRows.map((row) => row[i].length)),
  )

  const formatRow = (row) =>
    row.map((cell, i) => cell.padEnd(colWidths[i])).join('  ')

  const lines = allRows.map(formatRow)

  return [
    'Environment variables',
    '',
    ...lines,
    '',
    report.success ? 'All variables are valid.' : 'Some variables are invalid.',
  ].join('\n')
}

/**
 * Validates environment variables end-to-end and builds a full report.
 *
 * This function:
 * - validates values using the schema definition
 * - builds a structured report (including masking secrets)
 * - formats a printable output
 *
 * @param {Record<string, Object>} definition
 *   Environment schema definition.
 *
 * @param {Record<string, any>} values
 *   Raw environment values (e.g. process.env).
 *
 * @param {{
 *   mask?: (value: any) => string
 * }} [options]
 *
 * @returns {{
 *   success: boolean,
 *   validation: {
 *     success: boolean,
 *     data?: Record<string, any>,
 *     summary?: Record<string, string[]>
 *   },
 *   report: {
 *     success: boolean,
 *     params: Array<{
 *       key: string,
 *       value: any,
 *       displayValue: string,
 *       secret: boolean,
 *       valid: boolean,
 *       errors?: string[]
 *     }>
 *   },
 *   output: string
 * }}
 */
export function validateAndReportEnv(definition, values, options = {}) {
  const { mask } = options

  const validation = validateEnv(definition, values)
  const report = buildEnvReport(definition, values, validation, mask)
  const output = formatEnvReport(report)

  return {
    success: validation.success,
    validation,
    report,
    output,
  }
}
