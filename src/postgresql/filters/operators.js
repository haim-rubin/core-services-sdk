/**
 * @typedef {Function} OperatorFunction
 * @param {import('knex').Knex.QueryBuilder} q
 * @param {string} key
 * @param {*} value
 * @returns {import('knex').Knex.QueryBuilder}
 */

/**
 * @type {Object<string, OperatorFunction>}
 */
export const OPERATORS = {
  in: (q, key, value) => q.whereIn(key, value),
  nin: (q, key, value) => q.whereNotIn(key, value),

  eq: (q, key, value) => q.where(key, '=', value),
  ne: (q, key, value) => q.where(key, '!=', value),
  neq: (q, key, value) => q.where(key, '!=', value),

  gt: (q, key, value) => q.where(key, '>', value),
  gte: (q, key, value) => q.where(key, '>=', value),
  lt: (q, key, value) => q.where(key, '<', value),
  lte: (q, key, value) => q.where(key, '<=', value),

  like: (q, key, value) => q.where(key, 'like', value),
  ilike: (q, key, value) => q.where(key, 'ilike', value),

  isNull: (q, key, value) => (value ? q.whereNull(key) : q.whereNotNull(key)),

  isNotNull: (q, key, value) =>
    value ? q.whereNotNull(key) : q.whereNull(key),
}
