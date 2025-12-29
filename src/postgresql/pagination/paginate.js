import { applyFilter } from '../filters/apply-filter.js'
import { applyFilterSnakeCase } from '../filters/apply-filter-snake-case.js'
import { applyOrderBy } from '../modifiers/apply-order-by.js'
import { applyPagination } from '../modifiers/apply-pagination.js'
import { normalizeNumberOrDefault } from '../../core/normalize-premitives-types-or-default.js'

/**
 * Executes paginated query.
 *
 * @async
 */
export async function sqlPaginate({
  mapRow,
  orderBy,
  page = 1,
  baseQuery,
  limit = 10,
  filter = {},
  snakeCase = true,
}) {
  const listQuery = baseQuery.clone()
  const countQuery = baseQuery.clone()

  const applyFilterFn = snakeCase ? applyFilterSnakeCase : applyFilter

  applyFilterFn({ query: listQuery, filter })
  applyFilterFn({ query: countQuery, filter })

  applyOrderBy({ query: listQuery, orderBy })
  applyPagination({ query: listQuery, page, limit })

  const [rows, countResult] = await Promise.all([
    listQuery.select('*'),
    countQuery.count('* as count').first(),
  ])

  const totalCount = normalizeNumberOrDefault(countResult?.count || 0)
  const pages = Math.ceil(totalCount / limit)

  return {
    page,
    pages,
    totalCount,
    hasPrevious: page > 1,
    hasNext: page < pages,
    list: mapRow ? rows.map(mapRow) : rows,
  }
}
