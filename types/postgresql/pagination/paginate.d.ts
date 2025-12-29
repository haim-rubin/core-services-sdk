/**
 * Executes a paginated SQL query using a Knex query builder.
 *
 * This helper clones the provided base query twice:
 * one query is used to fetch the paginated list of rows,
 * and the second query is used to calculate the total count
 * of records matching the same filters.
 *
 * Filters are applied consistently to both queries.
 * Ordering and pagination are applied only to the list query.
 *
 * The function supports both camelCase and snake_case filters,
 * controlled by the `snakeCase` flag.
 *
 * @async
 * @param {Object} params
 * @param {import('knex').Knex.QueryBuilder} params.baseQuery
 *   A prepared Knex query builder representing the base query.
 *   It should not include pagination or ordering.
 *
 * @param {Object} [params.filter={}]
 *   An object describing filter conditions to apply.
 *   The structure is expected to be compatible with `applyFilter`
 *   or `applyFilterSnakeCase`.
 *
 * @param {boolean} [params.snakeCase=true]
 *   When true, applies filters assuming database columns
 *   are in snake_case. When false, camelCase is assumed.
 *
 * @param {Object|Array} [params.orderBy]
 *   Ordering definition passed directly to `applyOrderBy`.
 *   Can be a single order definition or an array of them.
 *
 * @param {number} [params.page=1]
 *   The current page number. Pages are 1-based.
 *
 * @param {number} [params.limit=10]
 *   The maximum number of rows per page.
 *
 * @param {Function} [params.mapRow]
 *   Optional mapping function applied to each returned row.
 *   Useful for transforming DB rows into domain entities.
 *
 * @returns {Promise<Object>} Pagination result object
 * @returns {number} return.page
 *   The current page number.
 *
 * @returns {number} return.pages
 *   Total number of available pages.
 *
 * @returns {number} return.totalCount
 *   Total number of records matching the filters.
 *
 * @returns {boolean} return.hasPrevious
 *   Indicates whether a previous page exists.
 *
 * @returns {boolean} return.hasNext
 *   Indicates whether a next page exists.
 *
 * @returns {Array<Object>} return.list
 *   The list of records for the current page.
 *   Rows are mapped using `mapRow` if provided.
 */
export function sqlPaginate({
  mapRow,
  orderBy,
  page,
  baseQuery,
  limit,
  filter,
  snakeCase,
}: {
  baseQuery: import('knex').Knex.QueryBuilder
  filter?: any
  snakeCase?: boolean
  orderBy?: any | any[]
  page?: number
  limit?: number
  mapRow?: Function
}): Promise<any>
