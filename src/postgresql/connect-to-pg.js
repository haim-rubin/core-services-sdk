import knex from 'knex'

/**
 * Creates and returns a Knex database connection instance.
 *
 * This function initializes a Knex client configured for PostgreSQL
 * using the provided connection configuration.
 *
 * @param {object|string} connection
 *   Knex connection configuration.
 *   Can be a connection object or a connection string.
 *
 * @returns {import('knex').Knex}
 *   A configured Knex database instance.
 */
export const connectToPg = (connection) => {
  const db = knex({
    connection,
    client: 'pg',
  })

  return db
}
