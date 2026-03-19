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
      // @ts-ignore
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

    it('should return raw response object if expectedType is raw', async () => {
      const mockResponse = createMockResponse({ body: 'raw data', status: 200 })
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await http.get({
        url: 'http://test.com',
        expectedType: ResponseType.raw,
      })

      expect(result).toBe(mockResponse)
      expect(result.status).toBe(200)
    })
  })

  describe('PUT with non-JSON body', () => {
    it('should not stringify string body', async () => {
      const rawBody = 'plain text body'
      mockFetch.mockResolvedValueOnce(createMockResponse({ body: 'OK' }))

      await http.put({
        url: 'http://test.com',
        body: rawBody,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test.com',
        expect.objectContaining({
          method: 'PUT',
          body: rawBody,
        }),
      )
    })
  })
})

describe('extraParams support', () => {
  it('should pass extraParams to fetch in GET', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    const controller = new AbortController()

    await http.get({
      url: 'http://test.com',
      extraParams: {
        signal: controller.signal,
        redirect: 'follow',
      },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        method: HTTP_METHODS.GET,
        signal: controller.signal,
        redirect: 'follow',
      }),
    )
  })

  it('should pass extraParams to fetch in POST', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.post({
      url: 'http://test.com',
      body: { a: 1 },
      extraParams: {
        credentials: 'include',
      },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        method: HTTP_METHODS.POST,
        credentials: 'include',
      }),
    )
  })

  it('should pass extraParams to fetch in DELETE', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.deleteApi({
      url: 'http://test.com',
      extraParams: {
        keepalive: true,
      },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        method: HTTP_METHODS.DELETE,
        keepalive: true,
      }),
    )
  })
})

describe('HEAD', () => {
  it('should send a HEAD request and return response object', async () => {
    const mockResponse = createMockResponse({
      status: 200,
      headers: { 'content-length': '1234' },
    })

    mockFetch.mockResolvedValueOnce(mockResponse)

    const result = await http.head({
      url: 'http://test.com',
    })

    expect(result).toBe(mockResponse)

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        method: HTTP_METHODS.HEAD,
      }),
    )
  })

  it('should expose response headers', async () => {
    const mockResponse = createMockResponse({
      headers: { etag: 'abc123' },
    })

    mockFetch.mockResolvedValueOnce(mockResponse)

    const result = await http.head({
      url: 'http://test.com',
    })

    expect(result.headers.get('etag')).toBe('abc123')
  })

  it('should throw HttpError on non-2xx status', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        status: 500,
        body: 'server error',
      }),
    )

    await expect(
      http.head({
        url: 'http://test.com',
      }),
    ).rejects.toThrow(HttpError)
  })
})

describe('edge cases', () => {
  it('should fallback to text when JSON parsing fails', async () => {
    const invalidJson = '{invalid json'

    mockFetch.mockResolvedValueOnce(createMockResponse({ body: invalidJson }))

    const result = await http.get({
      url: 'http://test.com',
      expectedType: ResponseType.json,
    })

    expect(result).toBe(invalidJson)
  })

  it('should fallback to text when XML parsing fails', async () => {
    const invalidXml = '<note><invalid></note>'

    mockFetch.mockResolvedValueOnce(createMockResponse({ body: invalidXml }))

    const result = await http.get({
      url: 'http://test.com',
      expectedType: ResponseType.xml,
    })

    expect(result).toBe(invalidXml)
  })

  it('should allow overriding headers', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.get({
      url: 'http://test.com',
      headers: {
        Authorization: 'Bearer token123',
      },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token123',
        }),
      }),
    )
  })

  it('should send DELETE request without body', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.deleteApi({
      url: 'http://test.com',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        method: HTTP_METHODS.DELETE,
      }),
    )
  })

  it('should include default JSON content-type header', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.post({
      url: 'http://test.com',
      body: { a: 1 },
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('should NOT add JSON content-type for Buffer', async () => {
    const buffer = Buffer.from('binary')

    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.post({
      url: 'http://test.com',
      body: buffer,
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('should NOT add JSON content-type for TypedArray', async () => {
    const uint8 = new Uint8Array([1, 2, 3])

    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.post({
      url: 'http://test.com',
      body: uint8,
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('should NOT add JSON content-type for ArrayBuffer', async () => {
    const buffer = new Uint8Array([1, 2]).buffer

    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.post({
      url: 'http://test.com',
      body: buffer,
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        headers: expect.not.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('should include default Accept header in GET', async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ body: JSON.stringify({ ok: true }) }),
    )

    await http.get({
      url: 'http://test.com',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
        }),
      }),
    )
  })

  it('HEAD should NOT include content-type header', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse())

    await http.head({
      url: 'http://test.com',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test.com',
      expect.objectContaining({
        headers: {},
      }),
    )
  })
})
