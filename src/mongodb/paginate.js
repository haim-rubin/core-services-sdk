import { ObjectId } from 'mongodb'

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

  // Cursor filtering
  if (cursor) {
    if (cursorField === '_id') {
      cursor = new ObjectId(cursor)
    }
    query[cursorField] = order === 'asc' ? { $gt: cursor } : { $lt: cursor }
  }

  // Fetch results
  const results = await collection
    .find(query, { projection })
    .sort(sort)
    .limit(limit)
    .toArray()

  // Get total count (for the original filter, not including cursor)
  const totalCount = await collection.countDocuments(filter)

  const paginationEdges =
    results.length > 0
      ? await getPaginationEdges({
          order,
          filter,
          results,
          collection,
          cursorField,
        })
      : { hasNext: false, hasPrevious: false }

  const { hasNext, hasPrevious } = paginationEdges
  return {
    order,
    totalCount,
    list: results,
    previous: hasPrevious && results.length ? results[0][cursorField] : null,
    next:
      hasNext && results.length
        ? results[results.length - 1][cursorField]
        : null,
  }
}

export async function getPaginationEdges({
  order,
  filter,
  results,
  collection,
  cursorField,
}) {
  const first = results[0][cursorField]
  const last = results[results.length - 1][cursorField]

  // Check if there are items before the first
  const hasPrevious =
    (await collection.countDocuments({
      ...filter,
      [cursorField]: order === 'asc' ? { $lt: first } : { $gt: first },
    })) > 0

  // Check if there are items after the last
  const hasNext =
    (await collection.countDocuments({
      ...filter,
      [cursorField]: order === 'asc' ? { $gt: last } : { $lt: last },
    })) > 0

  return {
    hasNext,
    hasPrevious,
  }
}
