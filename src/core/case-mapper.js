import { mapKeys, snakeCase, camelCase } from 'lodash-es'
import { sanitizeObjectAllowProps } from './sanitize-objects.js'

/**
 * Converts object keys from camelCase to snake_case.
 *
 * Optionally restricts the conversion to a whitelist of allowed properties.
 * If no allowed properties are provided, all object keys are converted.
 *
 * @param {Object} obj - The source object with camelCase keys.
 * @param {...string|string[]} allowedProps - Optional list (or arrays) of allowed property names.
 * @returns {Object} A new object with keys converted to snake_case.
 *
 * @example
 * toSnakeCase({ userId: '1', createdAt: 'now' })
 * // { user_id: '1', created_at: 'now' }
 *
 * @example
 * toSnakeCase({ userId: '1', createdAt: 'now' }, ['userId'])
 * // { user_id: '1' }
 */
export function toSnakeCase(obj, ...allowedProps) {
  const allowedPropsFixed = allowedProps.flat()
  const objFiltered = allowedPropsFixed.length
    ? sanitizeObjectAllowProps(obj, allowedPropsFixed)
    : obj

  return mapKeys(objFiltered, (_value, key) => {
    return snakeCase(key)
  })
}

/**
 * Converts object keys from snake_case to camelCase.
 *
 * Optionally restricts the conversion to a whitelist of allowed properties.
 * If no allowed properties are provided, all object keys are converted.
 *
 * @param {Object} obj - The source object with snake_case keys.
 * @param {...string|string[]} allowedProps - Optional list (or arrays) of allowed property names.
 * @returns {Object} A new object with keys converted to camelCase.
 *
 * @example
 * toCamelCase({ user_id: '1', created_at: 'now' })
 * // { userId: '1', createdAt: 'now' }
 *
 * @example
 * toCamelCase({ user_id: '1', created_at: 'now' }, ['user_id'])
 * // { userId: '1' }
 */
export function toCamelCase(obj, ...allowedProps) {
  const allowedPropsFixed = allowedProps.flat()
  const objFiltered = allowedPropsFixed.length
    ? sanitizeObjectAllowProps(obj, allowedPropsFixed)
    : obj

  return mapKeys(objFiltered, (_value, key) => {
    return camelCase(key)
  })
}
