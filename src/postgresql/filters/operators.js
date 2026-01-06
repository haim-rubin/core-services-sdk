/**
 * Map of filter operators to their corresponding Knex query builder methods.
 * Each operator function applies a WHERE condition to the query.
 *
 * @type {Object<string, OperatorFunction>}
 * @private
 */
export const OPERATORS = {
  /**
   * Array membership operator. Checks if column value is in the provided array.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {Array<*>} value - Array of values to match
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE IN clause
   */
  in: (q, key, value) => q.whereIn(key, value),

  /**
   * Not in array operator. Checks if column value is NOT in the provided array.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {Array<*>} value - Array of values to exclude
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE NOT IN clause
   */
  nin: (q, key, value) => q.whereNotIn(key, value),

  /**
   * Equality operator. Checks if column value equals the provided value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {*} value - Value to match
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE = clause
   */
  eq: (q, key, value) => q.where(key, '=', value),

  /**
   * Not equal operator. Checks if column value does not equal the provided value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {*} value - Value to exclude
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE != clause
   */
  ne: (q, key, value) => q.where(key, '!=', value),

  /**
   * Not equal operator (alias for `ne`). Checks if column value does not equal the provided value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {*} value - Value to exclude
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE != clause
   */
  neq: (q, key, value) => q.where(key, '!=', value),

  /**
   * Greater than operator. Checks if column value is greater than the provided value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {number|string|Date} value - Value to compare against
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE > clause
   */
  gt: (q, key, value) => q.where(key, '>', value),

  /**
   * Greater than or equal operator. Checks if column value is greater than or equal to the provided value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {number|string|Date} value - Value to compare against
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE >= clause
   */
  gte: (q, key, value) => q.where(key, '>=', value),

  /**
   * Less than operator. Checks if column value is less than the provided value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {number|string|Date} value - Value to compare against
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE < clause
   */
  lt: (q, key, value) => q.where(key, '<', value),

  /**
   * Less than or equal operator. Checks if column value is less than or equal to the provided value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {number|string|Date} value - Value to compare against
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE <= clause
   */
  lte: (q, key, value) => q.where(key, '<=', value),

  /**
   * Case-sensitive pattern matching operator. Uses SQL LIKE for pattern matching.
   * Supports wildcards: `%` (any sequence) and `_` (single character).
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {string} value - Pattern to match (e.g., '%invoice%')
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE LIKE clause
   */
  like: (q, key, value) => q.where(key, 'like', value),

  /**
   * Case-insensitive pattern matching operator. Uses PostgreSQL ILIKE for pattern matching.
   * Supports wildcards: `%` (any sequence) and `_` (single character).
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {string} value - Pattern to match (e.g., '%invoice%')
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE ILIKE clause
   */
  ilike: (q, key, value) => q.where(key, 'ilike', value),

  /**
   * Null check operator. Checks if column value is NULL or NOT NULL based on the boolean value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {boolean} value - If true, checks for NULL; if false, checks for NOT NULL
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE NULL or WHERE NOT NULL clause
   */
  isNull: (q, key, value) => (value ? q.whereNull(key) : q.whereNotNull(key)),

  /**
   * Not null check operator. Checks if column value is NOT NULL or NULL based on the boolean value.
   * @param {import('knex').Knex.QueryBuilder} q - Query builder
   * @param {string} key - Column name
   * @param {boolean} value - If true, checks for NOT NULL; if false, checks for NULL
   * @returns {import('knex').Knex.QueryBuilder} Query with WHERE NOT NULL or WHERE NULL clause
   */
  isNotNull: (q, key, value) =>
    value ? q.whereNotNull(key) : q.whereNull(key),
}
