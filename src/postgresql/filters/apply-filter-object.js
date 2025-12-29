import { OPERATORS } from './operators.js'

/**
 * Applies multiple operators on the same column.
 *
 * @param {import('knex').Knex.QueryBuilder} query
 * @param {string} qualifiedKey
 * @param {Object<string, *>} value
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyFilterObject(query, qualifiedKey, value) {
  return Object.entries(value).reduce((q, [operator, val]) => {
    if (!OPERATORS[operator]) {
      return q
    }

    return OPERATORS[operator](q, qualifiedKey, val)
  }, query)
}
