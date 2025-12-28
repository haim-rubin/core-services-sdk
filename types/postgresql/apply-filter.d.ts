/**
 * Builds a Knex query with MongoDB-style filter operators.
 * Pure utility function that can be used across repositories.
 *
 * This function applies various filter operators to build SQL WHERE clauses. All column names
 * are automatically qualified with the provided table name. Filter keys are used as-is without
 * any case conversion. If you need automatic camelCase to snake_case conversion, use
 * {@link applyFilterSnakeCase} instead.
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
 * - Filter keys are used as-is (no automatic case conversion)
 * - Qualified column names (table.column format)
 * - Multiple operators can be applied to the same field
 * - Unknown operators are silently ignored
 * - Arrays are automatically converted to IN clauses
 *
 * **Note:** This function does NOT convert filter keys. If your database uses snake_case columns
 * but your filter keys are in camelCase, use {@link applyFilterSnakeCase} instead, or ensure
 * your filter keys already match your database column names.
 *
 * @param {Object} params - Function parameters
 * @param {import('knex').Knex.QueryBuilder} params.query - Knex query builder instance to apply filters to
 * @param {Object<string, *>} params.filter - Filter object with keys matching database column names (used as-is)
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
 * // Filter keys are used as-is - ensure they match your database column names
 * applyFilter({ query, filter: { deleted_at: { isNull: true } }, tableName: 'assets' })
 * // SQL: WHERE assets.deleted_at IS NULL
 * // Note: If you need camelCase conversion, use applyFilterSnakeCase instead
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
/**
 * Applies MongoDB-style filter operators to a Knex query with automatic camelCase to snake_case conversion.
 *
 * This function is a convenience wrapper around {@link applyFilter} that automatically converts
 * all filter keys from camelCase to snake_case before applying the filters. This is useful when
 * your application code uses camelCase naming conventions but your database columns use snake_case.
 *
 * The function first converts all filter object keys using `toSnakeCase`, then applies the filters
 * using the standard `applyFilter` function. This ensures that filter keys like `userId` are
 * converted to `user_id` before being used in SQL queries.
 *
 * **Key Features:**
 * - Automatic camelCase to snake_case key conversion
 * - Same operator support as `applyFilter`
 * - Qualified column names (table.column format)
 * - Multiple operators can be applied to the same field
 * - Arrays are automatically converted to IN clauses
 *
 * **Supported Operators:**
 * Same as {@link applyFilter}:
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
 * @param {Object} params - Function parameters
 * @param {import('knex').Knex.QueryBuilder} params.query - Knex query builder instance to apply filters to
 * @param {Object<string, *>} params.filter - Filter object with camelCase keys (will be converted to snake_case)
 *   Filter values can be:
 *   - Simple values (string, number, boolean) → treated as equality
 *   - Arrays → treated as IN operator
 *   - Objects with operator keys → apply specific operators
 * @param {string} params.tableName - Table name used to qualify column names (e.g., "assets" → "assets.column_name")
 * @returns {import('knex').Knex.QueryBuilder} Modified query builder with applied WHERE clauses (using snake_case column names)
 *
 * @throws {TypeError} If query is not a valid Knex QueryBuilder instance
 *
 * @example
 * // Simple equality with camelCase key - converts to WHERE assets.user_id = 1
 * const query = db('assets').select('*')
 * applyFilterSnakeCase({ query, filter: { userId: 1 }, tableName: 'assets' })
 * // SQL: WHERE assets.user_id = 1
 *
 * @example
 * // Not equal with camelCase key - converts to WHERE assets.status != 'deleted'
 * applyFilterSnakeCase({
 *   query,
 *   filter: { status: { ne: 'deleted' } },
 *   tableName: 'assets'
 * })
 * // SQL: WHERE assets.status != 'deleted'
 *
 * @example
 * // Array/IN operator with camelCase key - converts to WHERE assets.status IN ('active', 'pending')
 * applyFilterSnakeCase({
 *   query,
 *   filter: { status: ['active', 'pending'] },
 *   tableName: 'assets'
 * })
 * // SQL: WHERE assets.status IN ('active', 'pending')
 *
 * @example
 * // Range operators with camelCase keys - converts to WHERE assets.price >= 100 AND assets.price <= 200
 * applyFilterSnakeCase({
 *   query,
 *   filter: { price: { gte: 100, lte: 200 } },
 *   tableName: 'assets'
 * })
 * // SQL: WHERE assets.price >= 100 AND assets.price <= 200
 *
 * @example
 * // Null checks with camelCase key - converts to WHERE assets.deleted_at IS NULL
 * applyFilterSnakeCase({
 *   query,
 *   filter: { deletedAt: { isNull: true } },
 *   tableName: 'assets'
 * })
 * // SQL: WHERE assets.deleted_at IS NULL
 *
 * @example
 * // Multiple filters with camelCase keys
 * applyFilterSnakeCase({
 *   query,
 *   filter: {
 *     userId: 123,              // Converts to user_id
 *     createdAt: { gte: '2024-01-01' },  // Converts to created_at
 *     status: 'active'
 *   },
 *   tableName: 'assets'
 * })
 * // SQL: WHERE assets.user_id = 123 AND assets.created_at >= '2024-01-01' AND assets.status = 'active'
 *
 * @see {@link applyFilter} For the base function without key conversion
 * @see {@link toSnakeCase} For details on the key conversion process
 */
export function applyFilterSnakeCase({
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
/**
 * Type definition for filter operator functions.
 * Each operator function applies a WHERE condition to a Knex query builder.
 */
export type OperatorFunction = Function
