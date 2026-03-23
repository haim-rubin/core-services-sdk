import pino from 'pino'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

import {
  stopRabbit,
  startRabbit,
  buildRabbitUri,
} from '../../src/rabbit-mq/start-stop-rabbitmq.js'

import { initializeQueue } from '../../src/rabbit-mq/index.js'

const RABBIT_CONTAINER = 'rabbit-test'
const AMQP_PORT = 5679
const UI_PORT = 15679
const USER = 'test'
const PASS = 'test'

const log = pino({
  level: 'silent',
})

const uniqueQueue = (name) => `${name}-${Date.now()}-${Math.random()}`

// @ts-ignore
async function waitForRabbitConnection({ uri, log, timeoutMs = 30000 }) {
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
  let rabbit

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
      if (rabbit) {
        await rabbit.close()
      }
    } finally {
      stopRabbit(RABBIT_CONTAINER)
    }
  })

  it('should publish, consume, unsubscribe, and stop consuming', async () => {
    const queue = uniqueQueue('integration')
    const receivedMessages = []

    const unsubscribe = await rabbit.subscribe({
      queue,
      onReceive: async (data) => {
        receivedMessages.push(data)
      },
    })

    await rabbit.publish(queue, { step: 1 })
    await waitFor(() => receivedMessages.length === 1)

    expect(receivedMessages).toEqual([{ step: 1 }])

    await unsubscribe()

    await rabbit.publish(queue, { step: 2 })

    await sleep(500)

    expect(receivedMessages).toEqual([{ step: 1 }])
  })

  describe('RabbitMQ queue name validation', () => {
    it('should throw when subscribing with invalid queues', async () => {
      const cases = [undefined, '', '   ']

      for (const queue of cases) {
        await expect(
          rabbit.subscribe({
            queue,
            onReceive: async () => {},
          }),
        ).rejects.toThrow('Invalid queue name')
      }
    })

    it('should throw when publishing with invalid queues', async () => {
      const cases = [undefined, '', '   ']

      for (const queue of cases) {
        await expect(rabbit.publish(queue, { test: true })).rejects.toThrow(
          'Invalid queue name',
        )
      }
    })

    it('should not affect valid queue when invalid publish is attempted', async () => {
      const queue = uniqueQueue('validation')
      const messages = []

      const unsub = await rabbit.subscribe({
        queue,
        onReceive: async (data) => {
          messages.push(data)
        },
      })

      await rabbit.publish(queue, { ok: true })
      await waitFor(() => messages.length === 1)

      expect(messages).toEqual([{ ok: true }])

      await expect(rabbit.publish(undefined, { bad: true })).rejects.toThrow()

      await sleep(300)

      expect(messages).toEqual([{ ok: true }])

      await unsub()
    })
  })
})

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
