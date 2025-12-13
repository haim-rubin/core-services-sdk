/**
 * Validates that the specified database tables exist.
 *
 * Checks all provided table names and collects any missing tables.
 * Throws a single error listing all missing tables after validation completes.
 *
 * @param {string|object} connection
 *   Database connection configuration.
 *   Can be a database connection URI or a Knex connection object.
 *
 * @param {string[]} tables
 *   List of required table names to validate.
 *
 * @returns {Promise<void>}
 *
 * @throws {Error}
 *   Throws an error if one or more required tables are missing.
 */
export function validateSchema(
  connection: string | object,
  tables: string[],
): Promise<void>
