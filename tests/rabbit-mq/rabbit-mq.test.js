import pino from 'pino'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

import {
  stopRabbit,
  startRabbit,
  buildRabbitUri,
} from '../resources/start-stop-rabbitmq.js'

import { initializeQueue } from '../../src/rabbit-mq/index.js'

const RABBIT_CONTAINER = 'rabbit-test'
const AMQP_PORT = 5679
const UI_PORT = 15679
const USER = 'test'
const PASS = 'test'
const QUEUE = 'integration-test-queue'

const log = pino({
  level: 'silent',
})
// @ts-ignore
async function waitForRabbitConnection({ uri, log, timeoutMs = 10000 }) {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const rabbit = await initializeQueue({ host: uri, log })
      return rabbit
    } catch {
      await sleep(300)
    }
  }

  throw new Error('RabbitMQ AMQP endpoint did not become ready in time')
}

describe('RabbitMQ integration', () => {
  // @ts-ignore
  let rabbit
  // @ts-ignore
  let unsubscribe
  // @ts-ignore
  let receivedMessages

  beforeAll(async () => {
    startRabbit({
      containerName: RABBIT_CONTAINER,
      amqpPort: AMQP_PORT,
      uiPort: UI_PORT,
      user: USER,
      pass: PASS,
    })

    const uri = buildRabbitUri({
      user: USER,
      pass: PASS,
      port: AMQP_PORT,
    })

    rabbit = await waitForRabbitConnection({
      uri,
      log,
    })
  }, 60_000)

  afterAll(async () => {
    try {
      // @ts-ignore
      if (unsubscribe) {
        await unsubscribe()
      }
      // @ts-ignore
      if (rabbit) {
        await rabbit.close()
      }
    } finally {
      stopRabbit(RABBIT_CONTAINER)
    }
  })

  it('should publish, consume, unsubscribe, and stop consuming', async () => {
    receivedMessages = []

    // @ts-ignore
    unsubscribe = await rabbit.subscribe({
      queue: QUEUE,
      // @ts-ignore
      onReceive: async (data) => {
        receivedMessages.push(data)
      },
    })

    // @ts-ignore
    await rabbit.publish(QUEUE, { step: 1 })
    await waitFor(() => receivedMessages.length === 1)

    // @ts-ignore
    expect(receivedMessages).toEqual([{ step: 1 }])

    await unsubscribe()

    // @ts-ignore
    await rabbit.publish(QUEUE, { step: 2 })

    await sleep(1000)

    // @ts-ignore
    expect(receivedMessages).toEqual([{ step: 1 }])
  })
})

/**
 * Waits until a condition becomes true or times out.
 *
 * @param {() => boolean} predicate
 * @param {number} timeoutMs
 */
async function waitFor(predicate, timeoutMs = 5000) {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    if (predicate()) {
      return
    }
    await sleep(50)
  }

  throw new Error('Condition not met within timeout')
}

/**
 * Sleeps for the given number of milliseconds.
 *
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
