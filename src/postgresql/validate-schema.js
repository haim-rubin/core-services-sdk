import { connectToPg } from './connect-to-pg.js'

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
export async function validateSchema({
  tables,
  connection,
  log = { error: console.error, info: console.info },
}) {
  const db = connectToPg(connection)

  const missingTables = []

  for (const table of tables) {
    const exists = await db.schema.hasTable(table)
    if (!exists) {
      missingTables.push(table)
    }
  }

  if (missingTables.length > 0) {
    const errorMessage = `Missing the following tables: ${missingTables.join(', ')}. Did you run migrations?`
    log.error(errorMessage)
    throw new Error(errorMessage)
  }

  if (tables.length) {
    log.info(`All required tables are exists: ${tables.join(', ')}`)
  }
}
