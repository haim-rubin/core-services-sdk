import Fastify from 'fastify'
import qs from 'qs'
import { normalizeOperators } from '../../src/core/normalize-array-operators.js'

export function buildServer() {
  const app = Fastify({
    querystringParser: (str) => qs.parse(str, { comma: true, depth: 10 }),
  })

  // GET /users
  app.get('/users', async (req) => {
    const dsl = normalizeOperators(req.query)
    return { dsl }
  })

  // POST /users/search
  app.post('/users/search', async (req) => {
    const dsl = normalizeOperators(req.body?.where || {})
    return { dsl }
  })

  return app
}
