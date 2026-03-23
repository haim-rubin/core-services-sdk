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

  const dockerRunCmd = `docker run -d \
        --name ${containerName} \
        -e RABBITMQ_DEFAULT_USER=${rest.user} \
        -e RABBITMQ_DEFAULT_PASS=${rest.pass} \
        -p ${rest.amqpPort}:5672 \
        -p ${rest.uiPort}:15672 \
        --health-cmd="rabbitmq-diagnostics -q ping" \
        --health-interval=5s \
        --health-timeout=5s \
        --health-retries=10 \
        rabbitmq:3-management`

  cleanupContainer(containerName, [rest.amqpPort, rest.uiPort])
  execSync(dockerRunCmd, { stdio: 'ignore' })
  waitForRabbitHealthy(containerName, dockerRunCmd, [
    rest.amqpPort,
    rest.uiPort,
  ])
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
    execSync(`docker rm -fv ${containerName}`, { stdio: 'ignore' })
  } catch (error) {
    console.error(`[RabbitTest] Failed to stop RabbitMQ: ${error}`)
  }
}

function cleanupContainer(containerName, ports = []) {
  try {
    execSync(`docker rm -fv ${containerName}`, { stdio: 'ignore' })
  } catch {}

  for (const port of ports) {
    try {
      const id = execSync(`docker ps -q --filter "publish=${port}"`, {
        encoding: 'utf8',
      }).trim()
      if (id) {
        execSync(`docker rm -fv ${id}`, { stdio: 'ignore' })
      }
    } catch {}
  }
}

/**
 * Waits until the RabbitMQ Docker container reports a healthy status.
 *
 * If the container crashes (e.g. due to Docker volume initialization race
 * on macOS), it is automatically recreated and retried.
 *
 * @param {string} containerName
 *   Docker container name.
 *
 * @param {string} dockerRunCmd
 *   The docker run command to recreate the container if it crashes.
 *
 * @param {number[]} ports
 *   Host ports to clean up when recreating.
 *
 * @returns {void}
 *
 * @throws {Error}
 *   Throws if the container does not become healthy within the timeout.
 */
function waitForRabbitHealthy(containerName, dockerRunCmd, ports) {
  console.log(`[RabbitTest] Waiting for RabbitMQ to be healthy...`)

  const maxRetries = 90
  const maxRestarts = 3
  let retries = 0
  let restarts = 0

  while (retries < maxRetries) {
    // Check if the container has crashed
    try {
      const status = execSync(
        `docker inspect --format='{{.State.Status}}' ${containerName}`,
        { encoding: 'utf8' },
      ).trim()

      if (status === 'exited' || status === 'dead') {
        if (restarts >= maxRestarts) {
          break
        }
        restarts++
        console.log(
          `[RabbitTest] Container crashed, restarting (${restarts}/${maxRestarts})...`,
        )
        cleanupContainer(containerName, ports)
        execSync(dockerRunCmd, { stdio: 'ignore' })
        execSync('sleep 2')
        retries++
        continue
      }
    } catch {}

    try {
      execSync(
        `docker exec ${containerName} rabbitmq-diagnostics -q ping`,
        { stdio: 'ignore' },
      )
      console.log(`[RabbitTest] RabbitMQ is ready.`)
      return
    } catch {
      if (retries % 10 === 0 && retries > 0) {
        console.log(
          `[RabbitTest] Still waiting... (${retries}/${maxRetries})`,
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
