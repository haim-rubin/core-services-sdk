// @ts-nocheck
import { ulid } from 'ulid'
import * as amqp from 'amqplib'

import { mask } from '../util/mask-sensitive.js'

/**
 * @typedef {Object} Log
 * @property {(obj: any, msg?: string) => void} info
 * @property {(obj: any, msg?: string) => void} error
 * @property {(obj: any, msg?: string) => void} debug
 */

const generateMsgId = () => `rbt_${ulid()}`

/**
 * Connects to a RabbitMQ server.
 *
 * @param {{ host: string, log: import('pino').Logger }} options
 * @returns {Promise<amqp.Connection>}
 */
export const connectQueueService = async ({ host, log }) => {
  const t0 = Date.now()
  const logger = log.child({
    op: 'connectQueueService',
    host: mask(host, '.', 3),
  })

  try {
    logger.debug('start')
    const connection = await amqp.connect(host)

    logger.info({
      event: 'ok',
      ms: Date.now() - t0,
    })

    return connection
  } catch (err) {
    logger.error(err, {
      event: 'error',
      ms: Date.now() - t0,
    })
    throw err
  }
}

/**
 * Creates a channel from a RabbitMQ connection.
 *
 * @param {{ host: string, log: import('pino').Logger }} options
 * @returns {Promise<{ channel: amqp.Channel, connection: amqp.Connection }>}
 */
export const createChannel = async ({ host, log }) => {
  const t0 = Date.now()
  const logger = log.child({ op: 'createChannel', host: mask(host, '.', 3) })

  try {
    logger.debug('start')
    const connection = /** @type {amqp.Connection} */ (
      await connectQueueService({ host, log })
    )
    const channel = await connection.createChannel()

    logger.debug('channel-created')
    logger.info({
      event: 'ok',
      ms: Date.now() - t0,
    })

    return { channel, connection }
  } catch (err) {
    logger.error(err, {
      event: 'error',
      ms: Date.now() - t0,
    })
    throw err
  }
}

/**
 * Parses a RabbitMQ message into a structured object.
 *
 * @param {amqp.ConsumeMessage} msgInfo
 * @returns {{ msgId: string, data: any, correlationId?: string }}
 */
const parseMessage = (msgInfo) => {
  return JSON.parse(msgInfo.content.toString())
}

/**
 * Subscribes to a queue to receive messages.
 *
 * @param {Object} options
 * @param {import('amqplib').Channel} options.channel - RabbitMQ channel
 * @param {string} options.queue - Queue name to subscribe to
 * @param {(data: any, correlationId?: string) => Promise<void>} options.onReceive - Async handler
 * @param {import('pino').Logger} options.log - Base logger
 * @param {boolean} [options.nackOnError=false] - Whether to nack the message on error (default: false)
 * @param {number} [options.prefetch=1] - Max unacked messages per consumer (default: 1)
 *
 * @returns {Promise<string>} Returns the consumer tag for later cancellation
 */
export const subscribeToQueue = async ({
  log,
  queue,
  channel,
  prefetch = 1,
  onReceive,
  nackOnError = false,
}) => {
  const logger = log.child({ op: 'subscribeToQueue', queue })

  try {
    await channel.assertQueue(queue, { durable: true })
    !!prefetch && (await channel.prefetch(prefetch))

    const { consumerTag } = await channel.consume(queue, async (msgInfo) => {
      if (!msgInfo) {
        return
      }
      const t0 = Date.now()

      const { msgId, data, correlationId } = parseMessage(msgInfo)
      const child = logger.child({ msgId, correlationId })

      try {
        child.debug('start')
        child.info('message-received')

        await onReceive(data, correlationId)
        channel.ack(msgInfo)

        child.info({
          event: 'ok',
          ms: Date.now() - t0,
        })
        return
      } catch (err) {
        nackOnError ? channel.nack(msgInfo) : channel.ack(msgInfo)

        child.error(err, {
          event: 'error',
          ms: Date.now() - t0,
        })
        return
      }
    })

    logger.debug({ consumerTag }, 'consumer-started')
    return consumerTag
  } catch (err) {
    logger.error(err, {
      event: 'error',
    })
    throw err
  }
}

/**
 * Initializes RabbitMQ integration with publish and subscribe support.
 *
 * @param {Object} options
 * @param {string} options.host - RabbitMQ connection URI
 * @param {import('pino').Logger} options.log - Logger
 *
 * @returns {Promise<{
 *   publish: (queue: string, data: any, correlationId?: string) => Promise<boolean>,
 *   subscribe: (options: {
 *     queue: string,
 *     onReceive: (data: any, correlationId?: string) => Promise<void>,
 *     nackOnError?: boolean
 *   }) => Promise<string>,
 *   channel: amqp.Channel,
 *   connection: amqp.Connection,
 *   close: () => Promise<void>
 * }>}
 */
export const initializeQueue = async ({ host, log }) => {
  const { channel, connection } = await createChannel({ host, log })
  const logger = log.child({ op: 'initializeQueue', host: mask(host, '.', 3) })

  /**
   * Publishes a message to a queue with a generated `rbt_<ulid>` ID.
   *
   * @param {string} queue - Queue name
   * @param {any} data - Payload to send
   * @param {string} [correlationId] - Correlation ID for tracing
   * @returns {Promise<boolean>} True if the message was sent successfully
   */
  const publish = async (queue, data, correlationId) => {
    const msgId = generateMsgId()
    const t0 = Date.now()
    const logChild = logger.child({
      op: 'publish',
      queue,
      msgId,
      correlationId,
    })

    try {
      logChild.debug('start')

      await channel.assertQueue(queue, { durable: true })
      const payload = { msgId, data, correlationId }
      const sent = channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(payload)),
      )

      logChild.debug('message-sent')
      logChild.info({
        event: 'ok',
        ms: Date.now() - t0,
      })

      return sent
    } catch (err) {
      logChild.error(err, {
        event: 'error',
        ms: Date.now() - t0,
      })
      throw err
    }
  }

  /**
   * Subscribes to a queue for incoming messages.
   *
   * @param {{
   *   queue: string,
   *   onReceive: (data: any, correlationId?: string) => Promise<void>,
   *   nackOnError?: boolean
   * }} options
   * @returns {Promise<string>} Returns the consumer tag for later cancellation
   */
  const subscribe = async ({ queue, onReceive, nackOnError = false }) => {
    return subscribeToQueue({ channel, queue, onReceive, log, nackOnError })
  }

  /**
   * Gracefully closes the RabbitMQ channel and connection.
   *
   * @returns {Promise<void>}
   */
  const close = async () => {
    const t0 = Date.now()
    const logChild = logger.child({ op: 'close' })

    try {
      logChild.debug('closing-channel-and-connection')
      await channel.close()
      await connection.close()

      logChild.info({
        event: 'ok',
        ms: Date.now() - t0,
      })
    } catch (err) {
      logChild.error(err, {
        event: 'error',
        ms: Date.now() - t0,
      })
      throw err
    }
  }

  return {
    channel,
    connection,
    publish,
    subscribe,
    close,
  }
}

/**
 * Builds a RabbitMQ URI string from environment variables.
 *
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
