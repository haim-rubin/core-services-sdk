/**
 * Starts a PostgreSQL Docker container for testing purposes.
 *
 * If a container with the same name already exists, it will be stopped and removed first.
 * The function blocks until PostgreSQL is ready to accept connections.
 *
 * @param {object} options
 * @param {number} [options.port=5433]
 *   Host port to bind PostgreSQL to.
 *
 * @param {string} [options.containerName='postgres-test']
 *   Docker container name.
 *
 * @param {string} [options.user='testuser']
 *   Database user name.
 *
 * @param {string} [options.pass='testpass']
 *   Database user password.
 *
 * @param {string} [options.db='testdb']
 *   Database name.
 *
 * @returns {void}
 *
 * @throws {Error}
 *   Throws if PostgreSQL does not become ready within the expected time.
 */
export function startPostgres({
  port,
  containerName,
  user,
  pass,
  db,
}: {
  port?: number
  containerName?: string
  user?: string
  pass?: string
  db?: string
}): void
/**
 * Stops and removes a PostgreSQL Docker container used for testing.
 *
 * If the container does not exist, the function exits silently.
 *
 * @param {string} [containerName='postgres-test']
 *   Docker container name.
 *
 * @returns {void}
 */
export function stopPostgres(containerName?: string): void
/**
 * Checks whether PostgreSQL inside the Docker container
 * is ready to accept connections.
 *
 * @param {string} containerName
 *   Docker container name.
 *
 * @param {string} user
 *   Database user name.
 *
 * @param {string} db
 *   Database name.
 *
 * @returns {boolean}
 *   Returns true if PostgreSQL is ready, otherwise false.
 */
export function isPostgresReady(
  containerName: string,
  user: string,
  db: string,
): boolean
/**
 * Waits until PostgreSQL inside the Docker container
 * is ready to accept connections.
 *
 * Retries for a fixed number of attempts before failing.
 *
 * @param {string} containerName
 *   Docker container name.
 *
 * @param {string} user
 *   Database user name.
 *
 * @param {string} db
 *   Database name.
 *
 * @returns {void}
 *
 * @throws {Error}
 *   Throws if PostgreSQL does not become ready within the timeout.
 */
export function waitForPostgres(
  containerName: string,
  user: string,
  db: string,
): void
/**
 * Build a PostgreSQL connection URI
 * @param {object} opts
 * @param {string} opts.user
 * @param {string} opts.pass
 * @param {number} opts.port
 * @param {string} opts.db
 */
export function buildPostgresUri({
  user,
  pass,
  port,
  db,
}: {
  user: string
  pass: string
  port: number
  db: string
}): string
