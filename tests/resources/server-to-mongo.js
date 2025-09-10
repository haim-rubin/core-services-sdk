import qs from 'qs'
import Fastify from 'fastify'

import { toMongo } from '../../src/mongodb/dsl-to-mongo.js'
import { normalizeOperators } from '../../src/core/normalize-array-operators.js'

export function buildServer() {
  const app = Fastify({
    querystringParser: (str) => qs.parse(str, { comma: true, depth: 10 }),
  })

  // GET /search?...
  app.get('/search', async (req) => {
    const dsl = normalizeOperators(req.query)
    const mongo = toMongo(dsl)
    return { dsl, mongo }
  })

  // POST /search with body { where: {...} }
  app.post('/search', async (req) => {
    // @ts-ignore
    const dsl = normalizeOperators(req.body?.where || {})
    const mongo = toMongo(dsl)
    return { dsl, mongo }
  })

  return app
}
