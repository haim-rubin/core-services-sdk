import { execSync } from 'node:child_process'

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
  port = 5433,
  containerName = 'postgres-test',
  user = 'testuser',
  pass = 'testpass',
  db = 'testdb',
}) {
  console.log(`[PgTest] Starting PostgreSQL on port ${port}...`)

  stopPostgres(containerName)

  execSync(
    `docker run -d \
      --name ${containerName} \
      -e POSTGRES_USER=${user} \
      -e POSTGRES_PASSWORD=${pass} \
      -e POSTGRES_DB=${db} \
      -p ${port}:5432 \
      postgres:16`,
    { stdio: 'inherit' },
  )

  waitForPostgres(containerName, user, db)
}

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

export function stopPostgres(containerName = 'postgres-test') {
  console.log(`[PgTest] Stopping PostgreSQL...`)
  try {
    execSync(`docker rm -f ${containerName}`, { stdio: 'ignore' })
  } catch {}
}

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

export function isPostgresReady(containerName, user, db) {
  try {
    execSync(
      `docker exec ${containerName} psql -U ${user} -d ${db} -c "SELECT 1"`,
      { stdio: 'ignore' },
    )
    return true
  } catch {
    return false
  }
}

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

export function waitForPostgres(containerName, user, db) {
  console.log(`[PgTest] Waiting for PostgreSQL to be ready...`)

  const maxRetries = 20
  let retries = 0
  let ready = false

  while (!ready && retries < maxRetries) {
    ready = isPostgresReady(containerName, user, db)
    if (!ready) {
      retries++
      execSync(`sleep 1`)
    }
  }

  if (!ready) {
    throw new Error(
      `[PgTest] PostgreSQL failed to start within ${maxRetries} seconds`,
    )
  }

  console.log(`[PgTest] PostgreSQL is ready.`)
}

/**
 * Build a PostgreSQL connection URI
 * @param {object} opts
 * @param {string} opts.user
 * @param {string} opts.pass
 * @param {number} opts.port
 * @param {string} opts.db
 */
export function buildPostgresUri({ user, pass, port, db }) {
  return `postgres://${user}:${pass}@localhost:${port}/${db}`
}
