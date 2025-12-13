/**
 * Validates that the specified database tables exist.
 *
 * Checks all provided table names and collects any missing tables.
 * Throws a single error listing all missing tables after validation completes.
 *
 * @param {Object} params
 *   Parameters object.
 *
 * @param {string|Object} params.connection
 *   Database connection configuration.
 *   Can be a database connection URI or a Knex connection object.
 *
 * @param {string[]} params.tables
 *   List of required table names to validate.
 *
 * @param {Object} [params.log]
 *   Optional logger object.
 *
 * @param {Function} [params.log.info]
 *   Logger function for informational messages.
 *
 * @param {Function} [params.log.error]
 *   Logger function for error messages.
 *
 * @returns {Promise<void>}
 *
 * @throws {Error}
 *   Throws an error if one or more required tables are missing.
 */
export function validateSchema({
  tables,
  connection,
  log,
}: {
  connection: string | any
  tables: string[]
  log?: {
    info?: Function
    error?: Function
  }
}): Promise<void>
