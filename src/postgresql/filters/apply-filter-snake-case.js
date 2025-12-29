import { toSnakeCase } from '../../core/case-mapper.js'
import { applyFilter } from './apply-filter.js'

/**
 * Applies filters with automatic camelCase to snake_case conversion.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {Object} params.filter
 */
export function applyFilterSnakeCase({ query, filter }) {
  return applyFilter({
    query,
    filter: toSnakeCase(filter),
  })
}
