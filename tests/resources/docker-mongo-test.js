import { execSync } from 'node:child_process'

/**
 * Start a MongoDB Docker container for testing (standalone)
 * @param {number} port - Host port for MongoDB
 * @param {string} containerName - Name of the Docker container
 */
export function startMongo(port = 27027, containerName = 'mongo-test') {
  console.log(`[MongoTest] Starting MongoDB on port ${port}...`)

  stopMongo(containerName)

  // Start MongoDB detached
  execSync(`docker run -d --name ${containerName} -p ${port}:27017 mongo:6.0`, {
    stdio: 'inherit',
  })

  waitForMongo(port)
}

/**
 * Start a MongoDB Replica Set Docker container for testing
 * @param {number} port - Host port for MongoDB
 * @param {string} containerName - Name of the Docker container
 * @param {string} replSet - Replica set name
 */
export function startMongoReplicaSet(
  port = 27027,
  containerName = 'mongo-rs-test',
  replSet = 'rs0',
) {
  console.log(
    `[MongoTest] Starting MongoDB Replica Set "${replSet}" on port ${port}...`,
  )

  try {
    // Run mongo with replica set enabled
    execSync(
      `docker run -d --name ${containerName} -p ${port}:27017 mongo:6.0 mongod --replSet ${replSet} --bind_ip_all`,
      { stdio: 'inherit' },
    )

    waitForMongo(port)

    // Initialize replica set
    console.log(`[MongoTest] Initializing replica set "${replSet}"...`)
    execSync(
      `docker exec ${containerName} mongosh --eval "rs.initiate({_id: '${replSet}', members:[{ _id:0, host: 'localhost:${port}' }]})"`,
      { stdio: 'inherit' },
    )
  } catch {
    console.warn(`[MongoTest] Replica set may already be initiated.`)
  }
}

/**
 * Stop and remove the MongoDB Docker container
 * @param {string} containerName
 */
export function stopMongo(containerName = 'mongo-test') {
  console.log(`[MongoTest] Stopping MongoDB...`)
  try {
    execSync(`docker rm -f ${containerName}`, { stdio: 'ignore' })
  } catch {}
}

function isConnected(port) {
  try {
    execSync(`mongosh --port ${port} --eval "db.runCommand({ ping: 1 })"`, {
      stdio: 'ignore',
    })
    return true
  } catch {
    return false
  }
}
/**
 * Wait until MongoDB is ready to accept connections
 * @param {number} port
 */
function waitForMongo(port) {
  console.log(`[MongoTest] Waiting for MongoDB to be ready...`)
  const maxRetries = 60
  let retries = 0
  let connected = false

  while (!connected && retries < maxRetries) {
    connected = isConnected(port)
    if (!connected) {
      retries++
      execSync(`sleep 1`)
    }
  }

  if (!connected) {
    throw new Error(
      `[MongoTest] MongoDB failed to start within ${maxRetries} seconds`,
    )
  }
  console.log(`[MongoTest] MongoDB is ready.`)
}
