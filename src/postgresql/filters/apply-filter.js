import { getTableNameFromQuery } from '../core/get-table-name.js'
import { OPERATORS } from './operators.js'
import { applyFilterObject } from './apply-filter-object.js'
import { applyOrFilter } from './apply-or-filter.js'

/**
 * Applies MongoDB-style filters to a Knex QueryBuilder.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {Object} [params.filter]
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyFilter({ query, filter = {}, snakeCase = false }) {
  const tableName = getTableNameFromQuery(query)

  if (!filter || Object.keys(filter).length === 0) {
    return query
  }

  return Object.entries(filter).reduce((q, [key, value]) => {
    if (key === 'or' && Array.isArray(value)) {
      return applyOrFilter(q, value, tableName, snakeCase)
    }

    const qualifiedKey = tableName ? `${tableName}.${key}` : key

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return applyFilterObject(q, qualifiedKey, value)
    }

    if (Array.isArray(value)) {
      return OPERATORS.in(q, qualifiedKey, value)
    }

    return OPERATORS.eq(q, qualifiedKey, value)
  }, query)
}
