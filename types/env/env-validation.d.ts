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
export function defToZod(def: {
  type: 'string' | 'number' | 'boolean'
  required?: boolean
  default?: any
  secret?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  enum?: string[]
  format?: 'email' | 'url'
  min?: number
  max?: number
  int?: boolean
  positive?: boolean
  negative?: boolean
}): import('zod').ZodTypeAny
/**
 * Builds a Zod object schema from a JSON definition map.
 *
 * @param {Record<string, Object>} definition
 *   Map of environment variable names to field definitions.
 *
 * @returns {import('zod').ZodObject<any>}
 */
export function createZodSchema(
  definition: Record<string, any>,
): import('zod').ZodObject<any>
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
export function validateEnv(
  definition: Record<string, any>,
  values: Record<string, any>,
):
  | {
      success: true
      data: Record<string, any>
    }
  | {
      success: false
      summary: Record<string, string[]>
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
export function buildEnvReport(
  definition: Record<string, any>,
  values: Record<string, any>,
  validationResult: {
    success: boolean
    data?: Record<string, any>
    summary?: Record<string, string[]>
  },
  mask: (value: any) => string,
): {
  success: boolean
  params: Array<{
    key: string
    value: any
    displayValue: string
    secret: boolean
    valid: boolean
    errors?: string[]
  }>
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
export function formatEnvReport(report: {
  success: boolean
  params: Array<{
    key: string
    displayValue: string
    secret: boolean
    valid: boolean
    errors?: string[]
  }>
}): string
