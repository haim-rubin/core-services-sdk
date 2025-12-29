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
  totalCount: number
  totalPages: number
  currentPage: number
  hasPrevious: boolean
  hasNext: boolean
  list: any
}>
