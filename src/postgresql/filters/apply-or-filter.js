import { snakeCase } from 'lodash-es'

import { OPERATORS } from './operators.js'
import { applyFilterObject } from './apply-filter-object.js'

/**
 * Applies OR filters.
 *
 * @param {import('knex').Knex.QueryBuilder} query
 * @param {Array<Object>} orFilters
 * @param {string | null} tableName
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyOrFilter(
  query,
  orFilters,
  tableName,
  snakeCaseFields = false,
) {
  return query.where(function () {
    orFilters.forEach((filterObj, index) => {
      this[index === 0 ? 'where' : 'orWhere'](function () {
        Object.entries(filterObj).forEach(([key, value]) => {
          const qualifiedKey = tableName
            ? `${tableName}.${snakeCaseFields ? snakeCase(key) : key}`
            : key

          if (value && typeof value === 'object' && !Array.isArray(value)) {
            applyFilterObject(this, qualifiedKey, value)
          } else if (Array.isArray(value)) {
            OPERATORS.in(this, qualifiedKey, value)
          } else {
            OPERATORS.eq(this, qualifiedKey, value)
          }
        })
      })
    })
  })
}
