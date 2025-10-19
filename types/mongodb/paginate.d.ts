/**
 * Pagination with SQL-like ascending/descending and total count
 *
 * @param {import('mongodb').Collection} collection
 * @param {Object} options
 * @param {Object} [options.filter={}]
 * @param {string} [options.cursorField='_id']
 * @param {string|Date|ObjectId} [options.cursor]
 * @param {'asc'|'desc'} [options.order='asc']
 * @param {number} [options.limit=10]
 */
export function paginateCursor(
  collection: import('mongodb').Collection,
  {
    limit,
    projection,
    filter,
    cursor,
    order,
    cursorField,
  }?: {
    filter?: any
    cursorField?: string
    cursor?: string | Date | ObjectId
    order?: 'asc' | 'desc'
    limit?: number
  },
): Promise<{
  order: 'asc' | 'desc'
  totalCount: number
  list: import('mongodb').WithId<import('bson').Document>[]
  previous: any
  next: any
}>
export function getPaginationEdges({
  order,
  filter,
  results,
  collection,
  cursorField,
}: {
  order: any
  filter: any
  results: any
  collection: any
  cursorField: any
}): Promise<{
  hasNext: boolean
  hasPrevious: boolean
}>
/**
 * Classic page/limit pagination with total count
 *
 * @param {import('mongodb').Collection} collection
 * @param {Object} options
 * @param {Object} [options.filter={}] - MongoDB filter
 * @param {string} [options.cursorField='_id'] - Field to sort by
 * @param {'asc'|'desc'} [options.order='desc'] - Sort order
 * @param {number} [options.limit=10] - Items per page
 * @param {number} [options.page=1] - Page number (1-based)
 * @param {Object} [options.projection] - Projection fields
 */
export function paginate(
  collection: import('mongodb').Collection,
  {
    sortBy,
    page,
    limit,
    filter,
    projection,
    order,
  }?: {
    filter?: any
    cursorField?: string
    order?: 'asc' | 'desc'
    limit?: number
    page?: number
    projection?: any
  },
): Promise<{
  order: 'asc' | 'desc'
  hasNext: boolean
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  list: import('mongodb').WithId<import('bson').Document>[]
  currentPage: number
}>
import { ObjectId } from 'mongodb'
