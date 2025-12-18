import { execSync } from 'node:child_process'

/**
 * Starts a RabbitMQ Docker container for testing purposes.
 *
 * If a container with the same name already exists, it will be removed first.
 * The container is started with the RabbitMQ Management plugin enabled and
 * waits until the health check reports the container as healthy.
 *
 * @param {Object} options
 * @param {string} options.containerName
 *   Docker container name.
 *
 * @param {number} options.amqpPort
 *   Host port mapped to RabbitMQ AMQP port (5672).
 *
 * @param {number} options.uiPort
 *   Host port mapped to RabbitMQ Management UI port (15672).
 *
 * @param {string} options.user
 *   Default RabbitMQ username.
 *
 * @param {string} options.pass
 *   Default RabbitMQ password.
 *
 * @returns {void}
 *
 * @throws {Error}
 *   Throws if the RabbitMQ container fails to become healthy within the timeout.
 */
export function startRabbit({ containerName, ...rest }) {
  console.log(`[RabbitTest] Starting RabbitMQ...`)

  try {
    execSync(`docker rm -f ${containerName}`, { stdio: 'ignore' })
  } catch {}

  execSync(
    `docker run -d \
        --name ${containerName} \
        -e RABBITMQ_DEFAULT_USER=${rest.user} \
        -e RABBITMQ_DEFAULT_PASS=${rest.pass} \
        -p ${rest.amqpPort}:5672 \
        -p ${rest.uiPort}:15672 \
        --health-cmd="rabbitmq-diagnostics -q ping" \
        --health-interval=5s \
        --health-timeout=5s \
        --health-retries=10 \
        rabbitmq:3-management`,
    { stdio: 'inherit' },
  )

  waitForRabbitHealthy(containerName)
}

/**
 * Stops and removes a RabbitMQ Docker container.
 *
 * This function is safe to call even if the container does not exist.
 *
 * @param {string} [containerName='rabbit-test']
 *   Docker container name.
 *
 * @returns {void}
 */
export function stopRabbit(containerName = 'rabbit-test') {
  console.log(`[RabbitTest] Stopping RabbitMQ...`)
  try {
    execSync(`docker rm -f ${containerName}`, { stdio: 'ignore' })
  } catch (error) {
    console.error(`[RabbitTest] Failed to stop RabbitMQ: ${error}`)
  }
}

/**
 * Waits until the RabbitMQ Docker container reports a healthy status.
 *
 * Polls the container health status using `docker inspect` and retries
 * for a fixed amount of time before failing.
 *
 * @param {string} containerName
 *   Docker container name.
 *
 * @returns {void}
 *
 * @throws {Error}
 *   Throws if the container does not become healthy within the timeout.
 */
function waitForRabbitHealthy(containerName) {
  console.log(`[RabbitTest] Waiting for RabbitMQ to be healthy...`)

  const maxRetries = 60
  let retries = 0

  while (retries < maxRetries) {
    try {
      const output = execSync(
        `docker inspect --format='{{.State.Health.Status}}' ${containerName}`,
        { encoding: 'utf8' },
      ).trim()

      if (output === 'healthy') {
        console.log(`[RabbitTest] RabbitMQ is ready.`)
        return
      }

      if (retries % 10 === 0 && retries > 0) {
        console.log(
          `[RabbitTest] Still waiting... Status: ${output} (${retries}/${maxRetries})`,
        )
      }
    } catch {
      if (retries % 10 === 0 && retries > 0) {
        console.log(
          `[RabbitTest] Container not ready yet (${retries}/${maxRetries})`,
        )
      }
    }

    retries++
    execSync(`sleep 1`)
  }

  console.log('[RabbitTest] Failed to start. Container logs:')
  try {
    execSync(`docker logs --tail 30 ${containerName}`, { stdio: 'inherit' })
  } catch {}

  throw new Error(
    `[RabbitTest] RabbitMQ failed to become healthy within ${maxRetries} seconds`,
  )
}

/**
 * Builds a RabbitMQ AMQP connection URI for local testing.
 *
 * @param {Object} options
 * @param {string} options.user
 *   RabbitMQ username.
 *
 * @param {string} options.pass
 *   RabbitMQ password.
 *
 * @param {number} options.port
 *   Host port mapped to RabbitMQ AMQP port.
 *
 * @returns {string}
 *   RabbitMQ AMQP connection URI.
 */
export function buildRabbitUri({ user, pass, port }) {
  return `amqp://${user}:${pass}@localhost:${port}`
}
