import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { runInTerminal, sleep } from './core-util.js'
import { initializeMongoDb } from '../src/mongodb/index.js'

const port = 2730
const dbName = 'testdb'
const host = 'localhost'
const mongoUri = `mongodb://${host}:${port}/?replicaSet=rs0`
const dockerStopCommand = `docker stop ${dbName} && docker rm ${dbName}`
const dockerCreateCommant = `docker run -d --name ${dbName} -p ${port}:27017 mongo --replSet rs0`
const dockerReplicaSetCommand = `docker exec -i ${dbName} mongosh --eval "rs.initiate()"`

describe('MongoDB Init & Transaction SDK', () => {
  let collections

  beforeAll(async () => {
    try {
      await runInTerminal(dockerStopCommand)
    } catch (error) {
      console.log('No existing container to stop.')
    }

    await runInTerminal(dockerCreateCommant)
    await sleep(5000)
    await runInTerminal(dockerReplicaSetCommand)

    collections = await initializeMongoDb({
      config: {
        uri: mongoUri,
        options: { dbName },
      },
      collectionNames: {
        users: 'users',
        logs: 'logs',
      },
    })

    await collections.users.deleteMany({})
    await collections.logs.deleteMany({})
  }, 60000)

  afterAll(async () => {
    if (collections?.client) {
      await collections.client.db(dbName).dropDatabase()
      await collections.client.close()
    }
  }, 20000)

  it.skip('should insert into multiple collections within a transaction', async () => {
    if (!collections) throw new Error('collections not initialized')

    await collections.withTransaction(async ({ session }) => {
      const userInsert = collections.users.insertOne(
        { name: 'Alice' },
        { session },
      )
      const logInsert = collections.logs.insertOne(
        { action: 'UserCreated', user: 'Alice' },
        { session },
      )
      await Promise.all([userInsert, logInsert])
    })

    const insertedUser = await collections.users.findOne({ name: 'Alice' })
    const insertedLog = await collections.logs.findOne({ user: 'Alice' })

    expect(insertedUser).not.toBeNull()
    expect(insertedLog).not.toBeNull()
  }, 20000)
}, 60000)
