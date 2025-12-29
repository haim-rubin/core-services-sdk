/**
 * Applies LIMIT and OFFSET.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 */
export function applyPagination({
  query,
  page,
  limit,
}: {
  query: import('knex').Knex.QueryBuilder
  page?: number
  limit?: number
}): import('knex').Knex.QueryBuilder<any, any>
