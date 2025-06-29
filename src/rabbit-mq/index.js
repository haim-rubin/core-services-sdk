import amqp from 'amqplib'
import { v4 as uuidv4 } from 'uuid'

/**
 * @typedef {Object} Log
 * @property {(msg: string) => void} info
 * @property {(msg: string, ...args: any[]) => void} error
 */

/**
 * Connects to RabbitMQ server.
 * @param {{ host: string }} options
 * @returns {Promise<amqp.Connection>}
 */
export const connectQueueService = async ({ host }) => {
  try {
    return await amqp.connect(host)
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error)
    throw error
  }
}

/**
 * Creates a channel from RabbitMQ connection.
 * @param {{ host: string }} options
 * @returns {Promise<amqp.Channel>}
 */
export const createChannel = async ({ host }) => {
  try {
    const connection = await connectQueueService({ host })
    return await connection.createChannel()
  } catch (error) {
    console.error('Failed to create channel:', error)
    throw error
  }
}

/**
 * Parses a RabbitMQ message.
 * @param {amqp.ConsumeMessage} msgInfo
 * @returns {{ msgId: string, data: any }}
 */
const parseMessage = (msgInfo) => {
  return JSON.parse(msgInfo.content.toString())
}

/**
 * Subscribes to a queue to receive messages.
 * @param {{
 *   channel: amqp.Channel,
 *   queue: string,
 *   onReceive: (data: any) => Promise<void>,
 *   log: Log,
 *   nackOnError?: boolean
 * }} options
 * @returns {Promise<void>}
 */
export const subscribeToQueue = async ({
  channel,
  queue,
  onReceive,
  log,
  nackOnError = false,
}) => {
  try {
    await channel.assertQueue(queue, { durable: true })

    channel.consume(queue, async (msgInfo) => {
      if (!msgInfo) return

      try {
        const { msgId, data } = parseMessage(msgInfo)
        log.info(`Handling message from '${queue}' msgId: ${msgId}`)
        await onReceive(data)
        channel.ack(msgInfo)
      } catch (error) {
        const { msgId } = parseMessage(msgInfo)
        log.error(`Error handling message: ${msgId} on queue '${queue}'`)
        log.error(error)
        nackOnError ? channel.nack(msgInfo) : channel.ack(msgInfo)
      }
    })
  } catch (error) {
    console.error('Failed to subscribe to queue:', error)
    throw error
  }
}

/**
 * Initializes RabbitMQ integration with publish and subscribe support.
 *
 * @param {Object} options
 * @param {string} options.host - RabbitMQ connection URI (e.g., 'amqp://user:pass@localhost:5672')
 * @param {Log} options.log - Logging utility with `info()` and `error()` methods
 *
 * @returns {Promise<{
 *   publish: (queue: string, data: any) => Promise<boolean>,
 *   subscribe: (options: {
 *     queue: string,
 *     onReceive: (data: any) => Promise<void>,
 *     nackOnError?: boolean
 *   }) => Promise<void>,
 *   channel: amqp.Channel
 * }>}
 *
 * @example
 * const rabbit = await initializeQueue({ host, log });
 * await rabbit.publish('jobs', { task: 'sendEmail' });
 * await rabbit.subscribe({
 *   queue: 'jobs',
 *   onReceive: async (data) => { console.log(data); },
 * });
 */
export const initializeQueue = async ({ host, log }) => {
  const channel = await createChannel({ host })

  /**
   * Publishes a message to a queue.
   * @param {string} queue
   * @param {any} data
   * @returns {Promise<boolean>}
   */
  const publish = async (queue, data) => {
    const msgId = uuidv4()
    try {
      await channel.assertQueue(queue, { durable: true })
      log.info(`Publishing to '${queue}' msgId: ${msgId}`)
      return channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify({ msgId, data })),
      )
    } catch (error) {
      log.error(`Error publishing to '${queue}' msgId: ${msgId}`)
      log.error(error)
      throw error
    }
  }

  /**
   * Subscribes to a queue.
   * @param {{
   *   queue: string,
   *   onReceive: (data: any) => Promise<void>,
   *   nackOnError?: boolean
   * }} options
   * @returns {Promise<void>}
   */
  const subscribe = async ({ queue, onReceive, nackOnError = false }) => {
    return subscribeToQueue({ channel, queue, onReceive, log, nackOnError })
  }

  return {
    channel,
    publish,
    subscribe,
  }
}

/**
 * Builds RabbitMQ URI from environment variables.
 * @param {{
 *   RABBIT_HOST: string,
 *   RABBIT_PORT: string | number,
 *   RABBIT_USERNAME: string,
 *   RABBIT_PASSWORD: string,
 *   RABBIT_PROTOCOL?: string
 * }} env
 * @returns {string}
 */
export const rabbitUriFromEnv = (env) => {
  const {
    RABBIT_HOST,
    RABBIT_PORT,
    RABBIT_USERNAME,
    RABBIT_PASSWORD,
    RABBIT_PROTOCOL = 'amqp',
  } = env

  return `${RABBIT_PROTOCOL}://${RABBIT_USERNAME}:${RABBIT_PASSWORD}@${RABBIT_HOST}:${RABBIT_PORT}`
}
