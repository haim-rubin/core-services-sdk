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
export function startRabbit({
  containerName,
  ...rest
}: {
  containerName: string
  amqpPort: number
  uiPort: number
  user: string
  pass: string
}): void
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
export function stopRabbit(containerName?: string): void
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
export function buildRabbitUri({
  user,
  pass,
  port,
}: {
  user: string
  pass: string
  port: number
}): string
