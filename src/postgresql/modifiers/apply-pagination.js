/**
 * Applies LIMIT and OFFSET.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 */
export function applyPagination({ query, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit
  return query.limit(limit).offset(offset)
}
