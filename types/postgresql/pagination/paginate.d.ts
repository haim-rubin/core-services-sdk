/**
 * Executes paginated query.
 *
 * @async
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
  mapRow: any
  orderBy: any
  page?: number
  baseQuery: any
  limit?: number
  filter?: {}
  snakeCase?: boolean
}): Promise<{
  page: number
  pages: number
  totalCount: number
  hasPrevious: boolean
  hasNext: boolean
  list: any
}>
