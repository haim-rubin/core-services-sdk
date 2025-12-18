import { toSnakeCase } from '../core/case-mapper.js'
import { normalizeNumberOrDefault } from '../core/normalize-premitives-types-or-default.js'

/**
 * Generic pagination utility.
 *
 * @async
 * @param {Object} params
 * @param {Object} params.db
 * @param {string} params.tableName
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {Object} [params.filter={}]
 * @param {Object} [params.orderBy]
 * @param {string} params.orderBy.column
 * @param {'asc'|'desc'} [params.orderBy.direction='asc']
 * @returns {Promise<{
 *   list: any[],
 *   totalCount: number,
 *   totalPages: number,
 *   currentPage: number,
 *   hasNext: boolean,
 *   hasPrevious: boolean
 * }>}
 */

export const sqlPaginate = async ({
  db,
  mapRow,
  orderBy,
  page = 1,
  limit = 10,
  tableName,
  filter = {},
} = {}) => {
  const offset = (page - 1) * limit

  const query = orderBy?.column
    ? db(tableName)
        .select('*')
        .where(toSnakeCase(filter))
        .orderBy(orderBy.column, orderBy.direction || 'asc')
    : db(tableName).select('*').where(toSnakeCase(filter))

  const [rows, countResult] = await Promise.all([
    query.limit(limit).offset(offset),
    db(tableName).where(toSnakeCase(filter)).count('* as count').first(),
  ])

  const totalCount = normalizeNumberOrDefault(countResult?.count || 0)
  const totalPages = Math.ceil(totalCount / limit)

  return {
    list: mapRow ? rows.map(mapRow) : rows,
    totalCount,
    totalPages,
    currentPage: page,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  }
}
