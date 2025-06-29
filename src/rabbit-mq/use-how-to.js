import { initializeQueue, rabbitUriFromEnv } from './rabbit.js'

const log = {
  info: console.log,
  error: console.error,
}

const start = async () => {
  const host = rabbitUriFromEnv(process.env)
  const rabbit = await initializeQueue({ host, log })

  await rabbit.subscribe({
    queue: 'testQueue',
    onReceive: async (data) => {
      console.log('Received:', data)
    },
  })

  await rabbit.publish('testQueue', { hello: 'world' })
}

start()
