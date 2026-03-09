import { getTableNameFromQuery } from '../core/get-table-name.js'

/**
 * @typedef {Object} OrderByItem
 * @property {string} column
 * @property {'asc' | 'desc'} [direction='asc']
 */

const ALLOWED_DIRECTIONS = ['asc', 'desc']

/**
 * Returns true if the column is a SQL expression or aggregate function call.
 * These must be passed to orderByRaw — Knex's .orderBy() would quote them.
 *
 * Examples:  "count(*)", "lower(name)", "max(created_at)"
 *
 * @param {string} column
 * @returns {boolean}
 */
function isSqlExpression(column) {
  return column.includes('(') || column.includes(')')
}

/**
 * Returns true if the column is already table-qualified.
 * These should be passed as-is to .orderBy() — no auto-prefix needed.
 *
 * Examples:  "tenants.name", "roles.role_type"
 *
 * @param {string} column
 * @returns {boolean}
 */
function isQualified(column) {
  return column.includes('.')
}

/**
 * Applies ORDER BY clause(s) to a Knex query builder.
 *
 * Supports single or multiple order definitions.
 *
 * Column handling:
 *   - SQL expressions (e.g. "lower(name)", "count(*)") → orderByRaw, never quoted
 *   - Already-qualified columns (e.g. "tenants.name") → orderBy as-is
 *   - Plain column names (e.g. "name") → auto-prefixed with base table name
 *     to avoid ambiguity in joined queries, matching applyFilter behaviour
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {OrderByItem | OrderByItem[]} params.orderBy
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyOrderBy({ query, orderBy }) {
  if (!orderBy) {
    return query
  }

  const tableName = getTableNameFromQuery(query)
  const orderByArray = [].concat(orderBy)

  return orderByArray.reduce((queryBuilder, item) => {
    if (!item || !item.column) {
      return queryBuilder
    }

    const direction = (item.direction || 'asc').toLowerCase()

    if (!ALLOWED_DIRECTIONS.includes(direction)) {
      throw new Error(`Invalid order direction: ${direction}`)
    }

    // SQL expressions must bypass Knex's column quoting
    if (isSqlExpression(item.column)) {
      return queryBuilder.orderByRaw(`${item.column} ${direction}`)
    }

    const column =
      tableName && !isQualified(item.column)
        ? `${tableName}.${item.column}`
        : item.column

    return queryBuilder.orderBy(column, direction)
  }, query)
}
