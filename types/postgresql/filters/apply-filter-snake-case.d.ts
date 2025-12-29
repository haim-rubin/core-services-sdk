/**
 * Applies filters with automatic camelCase to snake_case conversion.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {Object} params.filter
 */
export function applyFilterSnakeCase({
  query,
  filter,
}: {
  query: import('knex').Knex.QueryBuilder
  filter: any
}): import('knex').Knex.QueryBuilder<any, any>
