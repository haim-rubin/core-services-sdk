// @ts-nocheck
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import httpServer from 'node:http'
import { http } from '../../src/http/http.js'

let server
let baseUrl

function collectRaw(req) {
  return new Promise((resolve) => {
    const chunks = []

    req.on('data', (chunk) => {
      chunks.push(chunk)
    })

    req.on('end', () => {
      const buffer = Buffer.concat(chunks)
      resolve(buffer)
    })
  })
}

beforeAll(async () => {
  server = httpServer.createServer(async (req, res) => {
    const raw = await collectRaw(req)

    res.setHeader('content-type', 'application/json')

    res.end(
      JSON.stringify({
        method: req.method,
        headers: req.headers,
        body: raw.toString(),
        bodyLength: raw.length,
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

  it('should send array JSON correctly', async () => {
    const result = await http.post({
      url: `${baseUrl}/array`,
      body: [1, 2, 3],
    })

    expect(result.body).toBe(JSON.stringify([1, 2, 3]))
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

  it('should support Buffer (binary)', async () => {
    const buffer = Buffer.from('PDF-DATA-TEST')

    const result = await http.post({
      url: `${baseUrl}/buffer`,
      body: buffer,
      headers: {
        'Content-Type': 'application/pdf',
      },
    })

    expect(result.bodyLength).toBe(buffer.length)
    expect(result.body).toBe(buffer.toString())
  })

  it('should support Uint8Array (TypedArray)', async () => {
    const uint8 = new Uint8Array([1, 2, 3, 4])

    const result = await http.post({
      url: `${baseUrl}/typed`,
      body: uint8,
    })

    expect(result.bodyLength).toBe(uint8.length)
  })

  it('should support ArrayBuffer', async () => {
    const buffer = new Uint8Array([5, 6, 7]).buffer

    const result = await http.post({
      url: `${baseUrl}/arraybuffer`,
      body: buffer,
    })

    expect(result.bodyLength).toBe(3)
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

  it('should not send body when undefined', async () => {
    const result = await http.post({
      url: `${baseUrl}/empty`,
    })

    expect(result.bodyLength).toBe(0)
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

  it('should set JSON content-type by default', async () => {
    const result = await http.post({
      url: `${baseUrl}/json-header`,
      body: { a: 1 },
    })

    expect(result.headers['content-type']).toContain('application/json')
  })

  it('should allow overriding content-type', async () => {
    const result = await http.post({
      url: `${baseUrl}/override-header`,
      body: { a: 1 },
      headers: {
        'Content-Type': 'application/custom+json',
      },
    })

    expect(result.headers['content-type']).toContain('application/custom+json')
  })

  it('should preserve binary content-type', async () => {
    const buffer = Buffer.from('file')

    const result = await http.post({
      url: `${baseUrl}/pdf`,
      body: buffer,
      headers: {
        'Content-Type': 'application/pdf',
      },
    })

    expect(result.headers['content-type']).toContain('application/pdf')
  })

  it('should not force JSON content-type for URLSearchParams', async () => {
    const params = new URLSearchParams({ a: '1' })

    const result = await http.post({
      url: `${baseUrl}/urlencoded`,
      body: params,
    })

    expect(result.headers['content-type']).toContain(
      'application/x-www-form-urlencoded',
    )
  })

  it('should not override multipart content-type for FormData', async () => {
    const form = new FormData()
    form.append('field', 'value')

    const result = await http.post({
      url: `${baseUrl}/multipart`,
      body: form,
    })

    expect(result.headers['content-type']).toContain('multipart/form-data')
  })

  it('should respect content-type for string body', async () => {
    const result = await http.post({
      url: `${baseUrl}/text`,
      body: 'hello',
      headers: {
        'Content-Type': 'text/plain',
      },
    })

    expect(result.headers['content-type']).toContain('text/plain')
  })

  it('GET should NOT send content-type header', async () => {
    const result = await http.get({
      url: `${baseUrl}/get-no-content-type`,
    })

    expect(result.headers['content-type']).toBeUndefined()
  })

  it('should NOT add JSON content-type for Buffer without headers', async () => {
    const buffer = Buffer.from('binary')

    const result = await http.post({
      url: `${baseUrl}/buffer-no-header`,
      body: buffer,
    })

    expect(result.headers['content-type']).toBeUndefined()
  })

  it('should NOT add JSON content-type for TypedArray', async () => {
    const uint8 = new Uint8Array([1, 2, 3])

    const result = await http.post({
      url: `${baseUrl}/typed-no-header`,
      body: uint8,
    })

    expect(result.headers['content-type']).toBeUndefined()
  })

  it('should NOT add JSON content-type for ArrayBuffer', async () => {
    const buffer = new Uint8Array([1, 2]).buffer

    const result = await http.post({
      url: `${baseUrl}/arraybuffer-no-header`,
      body: buffer,
    })

    expect(result.headers['content-type']).toBeUndefined()
  })
})
