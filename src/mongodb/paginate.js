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
export async function paginateCursor(
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
      : { hasNext: null, hasPrevious: null }

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
export async function paginate(
  collection,
  {
    sortBy = '_id',
    page = 1,
    limit = 10,
    filter = {},
    projection,
    order = 'desc',
  } = {},
) {
  // Validation
  if (page < 1) {
    page = 1
  }
  if (limit < 1) {
    limit = 10
  }

  const sort = { [sortBy]: order === 'asc' ? 1 : -1 }
  const skip = (page - 1) * limit

  const [results, totalCount] = await Promise.all([
    collection
      .find(filter, { projection })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(filter),
  ])

  const totalPages = Math.ceil(totalCount / limit)
  const hasNext = page < totalPages
  const hasPrevious = page > 1

  return {
    order,
    hasNext,
    totalCount,
    totalPages,
    hasPrevious,
    list: results,
    currentPage: page,
  }
}
