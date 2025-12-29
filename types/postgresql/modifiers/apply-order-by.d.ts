/**
 * Applies ORDER BY clause.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {{ column: string, direction?: 'asc'|'desc' }} params.orderBy
 */
export function applyOrderBy({
  query,
  orderBy,
}: {
  query: import('knex').Knex.QueryBuilder
  orderBy: {
    column: string
    direction?: 'asc' | 'desc'
  }
}): import('knex').Knex.QueryBuilder<any, any>
