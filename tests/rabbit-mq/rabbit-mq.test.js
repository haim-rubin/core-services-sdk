import { describe, it, expect, beforeAll } from 'vitest'

import { initializeQueue, rabbitUriFromEnv } from '../../src/rabbit-mq/index.js'

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

const testLog = {
  info: () => {},
  error: console.error,
  debug: console.debug,
  child() {
    return testLog
  },
}

describe('RabbitMQ SDK', () => {
  const testQueue = 'testQueue'
  const host = 'amqp://botq:botq@0.0.0.0:5672'
  const testMessage = { text: 'Hello Rabbit' }

  let sdk
  let received = null

  beforeAll(async () => {
    // @ts-ignore
    sdk = await initializeQueue({ host, log: testLog })

    await sdk.subscribe({
      queue: testQueue,
      onReceive: async (data) => {
        received = data
      },
    })
  })

  it('should publish and receive message from queue', async () => {
    await sdk.publish(testQueue, testMessage)
    await sleep(300) // let the consumer process the message
    expect(received).toEqual(testMessage)
  })
})

describe('rabbitUriFromEnv', () => {
  it('should build valid amqp URI from env', () => {
    const env = {
      RABBIT_PORT: 5672,
      RABBIT_HOST: '0.0.0.0',
      RABBIT_USERNAME: 'botq',
      RABBIT_PASSWORD: 'botq',
      _RABBIT_HOST: '0.0.0.0',
      RABBIT_PROTOCOL: 'amqp',
    }

    const uri = rabbitUriFromEnv(env)
    expect(uri).toBe('amqp://botq:botq@0.0.0.0:5672')
  })

  it('should fallback to amqp when protocol is missing', () => {
    const env = {
      RABBIT_HOST: '0.0.0.0',
      RABBIT_PORT: 5672,
      RABBIT_USERNAME: 'botq',
      RABBIT_PASSWORD: 'botq',
    }

    const uri = rabbitUriFromEnv(env)
    expect(uri).toBe('amqp://botq:botq@0.0.0.0:5672')
  })
})
