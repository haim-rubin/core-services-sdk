/**
 * Applies ORDER BY clause(s) to a Knex query builder.
 *
 * Supports single or multiple order definitions.
 *
 * Column handling:
 *   - SQL expressions (e.g. "lower(name)", "count(*)") → orderByRaw, never quoted
 *   - Already-qualified columns (e.g. "tenants.name") → orderBy as-is
 *   - Plain column names (e.g. "name") → auto-prefixed with base table name
 *     to avoid ambiguity in joined queries, matching applyFilter behaviour
 *
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.query
 * @param {OrderByItem | OrderByItem[]} params.orderBy
 * @returns {import('knex').Knex.QueryBuilder}
 */
export function applyOrderBy({
  query,
  orderBy,
}: {
  query: import('knex').Knex.QueryBuilder
  orderBy: OrderByItem | OrderByItem[]
}): import('knex').Knex.QueryBuilder
export type OrderByItem = {
  column: string
  direction?: 'asc' | 'desc'
}
