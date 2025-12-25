import { toSnakeCase } from '../core/case-mapper.js'

/**
 * @typedef {Object} OperatorFunction
 * @property {import('knex').Knex.QueryBuilder} query - Knex query builder instance
 * @property {string} key - Column name (qualified with table name)
 * @property {*} value - Value to compare against
 * @returns {import('knex').Knex.QueryBuilder} Modified query builder
 */

/**
 * Map of filter operators to their corresponding Knex query builder methods.
 * Each operator function applies a WHERE condition to the query.
 *
 * @type {Object<string, OperatorFunction>}
 * @private
 */
const OPERATORS = {
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

/**
 * Applies filter operators from an object to a Knex query.
 * Processes each operator in the value object and applies the corresponding WHERE clause.
 * Unknown operators are silently ignored.
 *
 * @param {import('knex').Knex.QueryBuilder} q - Knex query builder instance
 * @param {string} qualifiedKey - Fully qualified column name (e.g., "table.column")
 * @param {Object<string, *>} value - Object containing operator-value pairs
 * @returns {import('knex').Knex.QueryBuilder} Modified query builder with applied filters
 * @private
 *
 * @example
 * // Apply multiple operators on the same field
 * applyFilterObject(query, 'assets.price', { gte: 100, lte: 200 })
 * // Results in: WHERE assets.price >= 100 AND assets.price <= 200
 */
const applyFilterObject = (q, qualifiedKey, value) => {
  return Object.entries(value).reduce(
    (q, [operator, val]) =>
      OPERATORS[operator] ? OPERATORS[operator](q, qualifiedKey, val) : q,
    q,
  )
}

/**
 * Builds a Knex query with MongoDB-style filter operators.
 * Pure utility function that can be used across repositories.
 *
 * This function converts camelCase filter keys to snake_case and applies
 * various filter operators to build SQL WHERE clauses. All column names
 * are automatically qualified with the provided table name.
 *
 * **Supported Operators:**
 * - `eq` - Equality (default for simple values)
 * - `ne` / `neq` - Not equal
 * - `in` - Array membership (or pass array directly)
 * - `nin` - Not in array
 * - `gt` - Greater than
 * - `gte` - Greater than or equal
 * - `lt` - Less than
 * - `lte` - Less than or equal
 * - `like` - Case-sensitive pattern matching (SQL LIKE)
 * - `ilike` - Case-insensitive pattern matching (PostgreSQL ILIKE)
 * - `isNull` - Check if field is NULL
 * - `isNotNull` - Check if field is NOT NULL
 *
 * **Key Features:**
 * - Automatic camelCase to snake_case conversion for filter keys
 * - Qualified column names (table.column format)
 * - Multiple operators can be applied to the same field
 * - Unknown operators are silently ignored
 * - Arrays are automatically converted to IN clauses
 *
 * @param {Object} params - Function parameters
 * @param {import('knex').Knex.QueryBuilder} params.query - Knex query builder instance to apply filters to
 * @param {Object<string, *>} params.filter - Filter object with camelCase keys (will be converted to snake_case)
 *   Filter values can be:
 *   - Simple values (string, number, boolean) → treated as equality
 *   - Arrays → treated as IN operator
 *   - Objects with operator keys → apply specific operators
 * @param {string} params.tableName - Table name used to qualify column names (e.g., "assets" → "assets.column_name")
 * @returns {import('knex').Knex.QueryBuilder} Modified query builder with applied WHERE clauses
 *
 * @throws {TypeError} If query is not a valid Knex QueryBuilder instance
 *
 * @example
 * // Simple equality - converts to WHERE assets.status = 'active'
 * const query = db('assets').select('*')
 * applyFilter({ query, filter: { status: 'active' }, tableName: 'assets' })
 *
 * @example
 * // Not equal - converts to WHERE assets.status != 'deleted'
 * applyFilter({ query, filter: { status: { ne: 'deleted' } }, tableName: 'assets' })
 *
 * @example
 * // Array/IN operator - converts to WHERE assets.status IN ('active', 'pending')
 * applyFilter({ query, filter: { status: ['active', 'pending'] }, tableName: 'assets' })
 *
 * @example
 * // Explicit IN operator
 * applyFilter({ query, filter: { status: { in: ['active', 'pending'] } }, tableName: 'assets' })
 *
 * @example
 * // Not in array - converts to WHERE assets.status NOT IN ('deleted', 'archived')
 * applyFilter({ query, filter: { status: { nin: ['deleted', 'archived'] } }, tableName: 'assets' })
 *
 * @example
 * // Range operators - converts to WHERE assets.price >= 100 AND assets.price <= 200
 * applyFilter({ query, filter: { price: { gte: 100, lte: 200 } }, tableName: 'assets' })
 *
 * @example
 * // Pattern matching (case-sensitive) - converts to WHERE assets.name LIKE '%invoice%'
 * applyFilter({ query, filter: { name: { like: '%invoice%' } }, tableName: 'assets' })
 *
 * @example
 * // Pattern matching (case-insensitive) - converts to WHERE assets.name ILIKE '%invoice%'
 * applyFilter({ query, filter: { name: { ilike: '%invoice%' } }, tableName: 'assets' })
 *
 * @example
 * // Null checks - converts to WHERE assets.deleted_at IS NULL
 * applyFilter({ query, filter: { deletedAt: { isNull: true } }, tableName: 'assets' })
 *
 * @example
 * // Multiple filters - converts to WHERE assets.status = 'active' AND assets.type = 'invoice' AND assets.price >= 100
 * applyFilter({
 *   query,
 *   filter: {
 *     status: 'active',
 *     type: 'invoice',
 *     price: { gte: 100 }
 *   },
 *   tableName: 'assets'
 * })
 *
 * @example
 * // camelCase conversion - deletedAt converts to deleted_at
 * applyFilter({ query, filter: { deletedAt: { isNull: true } }, tableName: 'assets' })
 * // SQL: WHERE assets.deleted_at IS NULL
 */
export function applyFilter({ query, filter, tableName }) {
  const convertedFilter = toSnakeCase(filter)

  return Object.entries(convertedFilter).reduce((q, [key, value]) => {
    const qualifiedKey = `${tableName}.${key}`

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return applyFilterObject(q, qualifiedKey, value)
    }

    if (Array.isArray(value)) {
      return OPERATORS.in(q, qualifiedKey, value)
    }

    return OPERATORS.eq(q, qualifiedKey, value)
  }, query)
}
