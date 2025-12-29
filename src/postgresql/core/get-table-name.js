/**
 * Extracts base table name from Knex QueryBuilder.
 * Relies on Knex internal structure.
 *
 * @param {import('knex').Knex.QueryBuilder} query
 * @returns {string|undefined}
 */
export function getTableNameFromQuery(query) {
  return query?._single?.table
}
