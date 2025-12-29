/**
 * Applies multiple operators on the same column.
 *
 * @param {import('knex').Knex.QueryBuilder} query
 * @param {string} qualifiedKey
 * @param {Object<string, *>} value
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyFilterObject(
  query: import('knex').Knex.QueryBuilder,
  qualifiedKey: string,
  value: {
    [x: string]: any
  },
): import('knex').Knex.QueryBuilder
