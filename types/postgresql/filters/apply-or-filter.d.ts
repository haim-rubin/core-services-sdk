/**
 * Applies OR filters.
 *
 * @param {import('knex').Knex.QueryBuilder} query
 * @param {Array<Object>} orFilters
 * @param {string | null} tableName
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyOrFilter(
  query: import('knex').Knex.QueryBuilder,
  orFilters: Array<any>,
  tableName: string | null,
  snakeCaseFields?: boolean,
): import('knex').Knex.QueryBuilder
