import { getTableNameFromQuery } from '../core/get-table-name.js'

/**
 * Applies ORDER BY clause.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {{ column: string, direction?: 'asc'|'desc' }} params.orderBy
 */
export function applyOrderBy({ query, orderBy }) {
  if (!orderBy?.column) {
    return query
  }

  const tableName = getTableNameFromQuery(query)
  const column = tableName ? `${tableName}.${orderBy.column}` : orderBy.column

  return query.orderBy(column, orderBy.direction || 'asc')
}
