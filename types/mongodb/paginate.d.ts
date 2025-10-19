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
export function paginate(
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
import { ObjectId } from 'mongodb'
