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
export function applyOrderBy({
  query,
  orderBy,
}: {
  query: import('knex').Knex.QueryBuilder
  orderBy: OrderByItem | OrderByItem[]
}): import('knex').Knex.QueryBuilder
export type OrderByItem = {
  /**
   * - Column name to order by
   */
  column: string
  /**
   * - Order direction
   */
  direction?: 'asc' | 'desc'
}
