import { vi, it, expect, describe, afterEach } from 'vitest'

import { http } from '../../src/http/http.js'
import { HttpError } from '../../src/http/HttpError.js'
import { HTTP_METHODS } from '../../src/http/http-method.js'
import { ResponseType } from '../../src/http/responseType.js'

// Mock the global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

const createMockResponse = ({
  body = '',
  status = 200,
  statusText = 'OK',
  headers = {},
} = {}) => {
  return {
    status,
    statusText,
    text: vi.fn().mockResolvedValue(body),
    headers: {
      get: vi.fn().mockImplementation((k) => headers[k]),
    },
  }
}

describe('http client (native fetch)', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return parsed JSON response', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ body: JSON.stringify({ hello: 'world' }) }),
      )

      const result = await http.get({ url: 'http://test.com' })
      expect(result).toEqual({ hello: 'world' })
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test.com',
        expect.objectContaining({ method: HTTP_METHODS.GET }),
      )
    })

    it('should throw HttpError on non-2xx status', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          status: 404,
          statusText: 'Not Found',
          body: JSON.stringify({ error: 'not found' }),
        }),
      )

      await expect(http.get({ url: 'http://fail.com' })).rejects.toThrow(
        HttpError,
      )
    })
  })

  describe('POST', () => {
    it('should send a JSON body and return parsed JSON', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ body: JSON.stringify({ ok: true }) }),
      )

      const result = await http.post({
        url: 'http://test.com',
        body: { test: 123 },
      })

      expect(result).toEqual({ ok: true })
      expect(mockFetch).toHaveBeenCalledWith(
        'http://test.com',
        expect.objectContaining({
          method: HTTP_METHODS.POST,
          body: JSON.stringify({ test: 123 }),
        }),
      )
    })
  })

  describe('PUT', () => {
    it('should send a PUT request and return JSON', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ body: JSON.stringify({ updated: true }) }),
      )

      const result = await http.put({
        url: 'http://test.com',
        body: { name: 'Updated' },
      })

      expect(result).toEqual({ updated: true })
    })
  })

  describe('PATCH', () => {
    it('should send a PATCH request and return JSON', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ body: JSON.stringify({ patched: true }) }),
      )

      const result = await http.patch({
        url: 'http://test.com',
        body: { field: 'value' },
      })

      expect(result).toEqual({ patched: true })
    })
  })

  describe('DELETE', () => {
    it('should send a DELETE request with body and return JSON', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({ body: JSON.stringify({ deleted: true }) }),
      )

      const result = await http.deleteApi({
        url: 'http://test.com',
        body: { id: 1 },
      })

      expect(result).toEqual({ deleted: true })
    })
  })

  describe('ResponseType', () => {
    it('should return text if expectedType is text', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ body: 'hello' }))

      const result = await http.get({
        url: 'http://test.com',
        expectedType: ResponseType.text,
      })

      expect(result).toBe('hello')
    })

    it('should return XML as parsed object if expectedType is xml', async () => {
      const xml = `<note><to>User</to><from>ChatGPT</from></note>`
      mockFetch.mockResolvedValueOnce(createMockResponse({ body: xml }))

      const result = await http.get({
        url: 'http://test.com',
        expectedType: ResponseType.xml,
      })

      expect(result).toHaveProperty('note')
    })
  })
})
