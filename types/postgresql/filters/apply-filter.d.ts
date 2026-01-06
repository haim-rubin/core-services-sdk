/**
 * Applies MongoDB-style filters to a Knex QueryBuilder.
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {Object} [params.filter]
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyFilter({
  query,
  filter,
  snakeCase,
}: {
  query: import('knex').Knex.QueryBuilder
  filter?: any
}): import('knex').Knex.QueryBuilder
