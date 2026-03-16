// @ts-nocheck
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import httpServer from 'node:http'
import { http } from '../../src/http/http.js'

let server
let baseUrl

function collectBody(req) {
  return new Promise((resolve) => {
    const chunks = []

    req.on('data', (chunk) => {
      chunks.push(chunk)
    })

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString())
    })
  })
}

beforeAll(async () => {
  server = httpServer.createServer(async (req, res) => {
    const body = await collectBody(req)

    res.setHeader('content-type', 'application/json')

    res.end(
      JSON.stringify({
        method: req.method,
        headers: req.headers,
        body,
      }),
    )
  })

  await new Promise((resolve) => {
    server.listen(0, () => {
      const { port } = server.address()
      baseUrl = `http://localhost:${port}`
      resolve()
    })
  })
})

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve))
})

describe('http util integration', () => {
  it('should send JSON body', async () => {
    const result = await http.post({
      url: `${baseUrl}/json`,
      body: { hello: 'world' },
    })

    expect(result.method).toBe('POST')
    expect(result.body).toBe(JSON.stringify({ hello: 'world' }))
  })

  it('should send string body without stringify', async () => {
    const result = await http.post({
      url: `${baseUrl}/string`,
      body: 'plain-text',
    })

    expect(result.body).toBe('plain-text')
  })

  it('should support base64 string', async () => {
    const base64 = Buffer.from('hello').toString('base64')

    const result = await http.post({
      url: `${baseUrl}/base64`,
      body: base64,
    })

    expect(result.body).toBe(base64)
  })

  it('should support URLSearchParams', async () => {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'read',
    })

    const result = await http.post({
      url: `${baseUrl}/form`,
      body: params,
    })

    expect(result.body).toBe(params.toString())
  })

  it('should support PUT with JSON', async () => {
    const result = await http.put({
      url: `${baseUrl}/put`,
      body: { a: 1 },
    })

    expect(result.method).toBe('PUT')
    expect(result.body).toBe(JSON.stringify({ a: 1 }))
  })

  it('should support PATCH with JSON', async () => {
    const result = await http.patch({
      url: `${baseUrl}/patch`,
      body: { b: 2 },
    })

    expect(result.method).toBe('PATCH')
    expect(result.body).toBe(JSON.stringify({ b: 2 }))
  })

  it('should support DELETE with body', async () => {
    const result = await http.deleteApi({
      url: `${baseUrl}/delete`,
      body: { remove: true },
    })

    expect(result.method).toBe('DELETE')
    expect(result.body).toBe(JSON.stringify({ remove: true }))
  })

  it('should support GET request', async () => {
    const result = await http.get({
      url: `${baseUrl}/get`,
    })

    expect(result.method).toBe('GET')
  })

  it('should support HEAD request', async () => {
    const response = await http.head({
      url: `${baseUrl}/head`,
    })

    expect(response.status).toBe(200)
  })
})
