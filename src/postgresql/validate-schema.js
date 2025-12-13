import { connectToPg } from './connect-to-pg.js'

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
export async function validateSchema(connection, tables) {
  const db = connectToPg(connection)

  const missingTables = []

  for (const table of tables) {
    const exists = await db.schema.hasTable(table)
    if (!exists) {
      missingTables.push(table)
    }
  }

  if (missingTables.length > 0) {
    throw new Error(
      `Missing the following tables: ${missingTables.join(', ')}. ` +
        `Did you run migrations?`,
    )
  }
}
