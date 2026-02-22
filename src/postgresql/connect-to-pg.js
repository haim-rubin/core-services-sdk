import knex from 'knex'

/**
 * Creates and returns a Knex PostgreSQL connection instance
 * with sane default pool and timeout configuration.
 *
 * Defaults are optimized for typical API / service workloads
 * and can be overridden by the caller if needed.
 *
 * @param {object|string} connection
 *   Knex connection configuration or connection string.
 *
 * @param {object} [options]
 *   Optional Knex overrides.
 *
 * @param {object} [options.pool]
 *   Knex pool configuration overrides.
 *
 * @returns {import('knex').Knex}
 *   A configured Knex database instance.
 */
export const connectToPg = (connection, options = {}) => {
  const db = knex({
    client: 'pg',
    connection,

    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 10000,
      createTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      propagateCreateError: false,
      ...(options.pool || {}),
    },

    ...options,
  })

  return db
}
