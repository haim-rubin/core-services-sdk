/**
 * Convert a normalized query object into a MongoDB query object.
 *
 * Supported operators: eq, in, nin, gt, gte, lt, lte, and, or.
 *
 * Example input:
 * {
 *   userId: { in: ['123','456'] },
 *   status: { eq: 'active' },
 *   age: { gte: 18 },
 *   or: [
 *     { role: { eq: 'admin' } },
 *     { status: { eq: 'active' } }
 *   ]
 * }
 *
 * Example output:
 * {
 *   userId: { $in: ['123','456'] },
 *   status: { $eq: 'active' },
 *   age: { $gte: 18 },
 *   $or: [
 *     { role: { $eq: 'admin' } },
 *     { status: { $eq: 'active' } }
 *   ]
 * }
 *
 * @param {Record<string, any>} query - The normalized query object
 * @returns {Record<string, any>} - A MongoDB query object
 */
/**
 * Map DSL logical keywords to Mongo operators.
 */
const LOGICAL_OPS = new Map([
  ['or', '$or'],
  ['and', '$and'],
  ['nor', '$nor'],
  ['not', '$not'],
])

/**
 * Convert a condition object (e.g. { gt: 18, lt: 65 }) into Mongo condition.
 * Recursively applies to nested objects.
 */
function convertCondition(condition) {
  if (
    condition === null ||
    typeof condition !== 'object' ||
    Array.isArray(condition)
  ) {
    return condition // primitive or array stays as is
  }

  return Object.fromEntries(
    Object.entries(condition).map(([op, value]) => {
      if (op.startsWith('$')) {
        return [op, value] // already Mongo operator
      }
      const mongoOp = `$${op}`
      return [mongoOp, convertCondition(value)]
    }),
  )
}

/**
 * Convert a normalized query object into a MongoDB query object.
 *
 * @param {Record<string, any>} query - normalized DSL query
 * @returns {Record<string, any>} - MongoDB query object
 */
export function toMongo(query = {}) {
  return Object.fromEntries(
    Object.entries(query).map(([field, condition]) => {
      // logical operator
      if (LOGICAL_OPS.has(field)) {
        const mongoOp = LOGICAL_OPS.get(field)
        if (Array.isArray(condition)) {
          return [mongoOp, condition.map(toMongo)]
        }
        if (condition && typeof condition === 'object') {
          return [mongoOp, toMongo(condition)]
        }
        return [mongoOp, condition]
      }

      // operator object
      if (
        condition !== null &&
        typeof condition === 'object' &&
        !Array.isArray(condition)
      ) {
        return [field, convertCondition(condition)]
      }

      // plain value or null → $eq
      return [field, { $eq: condition }]
    }),
  )
}

export function castIsoDates(obj) {
  if (Array.isArray(obj)) {
    return obj.map(castIsoDates)
  }
  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      obj[key] = castIsoDates(value)
    }
    return obj
  }
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
    const d = new Date(obj)
    if (!isNaN(d)) {
      return d
    }
  }
  return obj
}
