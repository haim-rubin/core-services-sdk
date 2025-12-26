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
export function applyFilter({
  query,
  filter,
  tableName,
}: {
  query: import('knex').Knex.QueryBuilder
  filter: {
    [x: string]: any
  }
  tableName: string
}): import('knex').Knex.QueryBuilder
export type OperatorFunction = {
  /**
   * - Knex query builder instance
   */
  query: import('knex').Knex.QueryBuilder
  /**
   * - Column name (qualified with table name)
   */
  key: string
  /**
   * - Value to compare against
   */
  value: any
}
