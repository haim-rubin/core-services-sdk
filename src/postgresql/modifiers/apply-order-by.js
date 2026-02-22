import { getTableNameFromQuery } from '../core/get-table-name.js'

/**
 * @typedef {Object} OrderByItem
 * @property {string} column - Column name to order by
 * @property {'asc' | 'desc'} [direction='asc'] - Order direction
 */

const ALLOWED_DIRECTIONS = ['asc', 'desc']

/**
 * Applies ORDER BY clause(s) to a Knex query builder.
 *
 * Supports a single orderBy object or an array of orderBy objects.
 * Validates order direction to prevent invalid SQL.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query - Knex query builder instance
 * @param {OrderByItem | OrderByItem[]} params.orderBy - Order by definition(s)
 * @returns {import('knex').Knex.QueryBuilder} The modified query builder
 */
export function applyOrderBy({ query, orderBy }) {
  if (!orderBy) {
    return query
  }

  const tableName = getTableNameFromQuery(query)
  const orderByArray = [].concat(orderBy)

  return orderByArray.reduce((query, item) => {
    if (!item?.column) {
      return query
    }

    const direction = item.direction || 'asc'

    if (!ALLOWED_DIRECTIONS.includes(direction)) {
      throw new Error(`Invalid order direction: ${direction}`)
    }

    const column = tableName ? `${tableName}.${item.column}` : item.column

    return query.orderBy(column, direction)
  }, query)
}
