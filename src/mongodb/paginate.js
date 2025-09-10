import { ObjectId } from 'mongodb'

/**
 * Pagination with SQL-like ascending/descending
 *
 * @param {import('mongodb').Collection} collection
 * @param {Object} options
 * @param {Object} [options.filter={}]
 * @param {string} [options.cursorField='_id']
 * @param {string|Date|ObjectId} [options.cursor]
 * @param {'asc'|'desc'} [options.order='asc']
 * @param {number} [options.limit=10]
 */
export async function paginate(
  collection,
  {
    limit = 10,
    projection,
    filter = {},
    cursor = null,
    order = 'desc',
    cursorField = '_id',
  } = {},
) {
  const query = { ...filter }
  const sort = { [cursorField]: order === 'asc' ? 1 : -1 }

  if (cursor) {
    if (cursorField === '_id') {
      cursor = new ObjectId(cursor)
    }

    query[cursorField] = order === 'asc' ? { $gt: cursor } : { $lt: cursor }
  }

  const results = await collection
    .find(query, { projection })
    .sort(sort)
    .limit(limit)
    .toArray()

  return {
    order,
    list: results,
    previous: results.length ? results[0][cursorField] : null,
    next: results.length ? results[results.length - 1][cursorField] : null,
  }
}
