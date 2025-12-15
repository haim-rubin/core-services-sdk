// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { createRequestLogger } from '../../../src/http/helpers/create-request-logger.js'
import { Context } from '../../../src/util/context.js'
//@ts-ignore
describe('createRequestLogger', () => {
  let baseLogger

  beforeEach(() => {
    baseLogger = {
      child: vi.fn(),
    }
  })

  it('creates a child logger with context and request data', () => {
    const request = {
      method: 'GET',
      url: '/test',
      raw: { url: '/raw-test' },
    }

    const childLogger = {}
    baseLogger.child.mockReturnValue(childLogger)

    Context.run(
      {
        correlationId: 'corr-123',
        ip: '127.0.0.1',
        userAgent: 'vitest-agent',
      },
      () => {
        const result = createRequestLogger(request, baseLogger)

        expect(baseLogger.child).toHaveBeenCalledOnce()
        expect(baseLogger.child).toHaveBeenCalledWith({
          ip: '127.0.0.1',
          userAgent: 'vitest-agent',
          correlationId: 'corr-123',
          op: 'GET /test',
        })

        expect(result).toBe(childLogger)
      },
    )
  })

  it('falls back to routeOptions.url when request.url is missing', () => {
    const request = {
      method: 'POST',
      routeOptions: { url: '/route-url' },
      raw: { url: '/raw-url' },
    }

    Context.run(
      {
        correlationId: 'corr-456',
        ip: '10.0.0.1',
        userAgent: 'agent-x',
      },
      () => {
        createRequestLogger(request, baseLogger)

        expect(baseLogger.child).toHaveBeenCalledWith(
          expect.objectContaining({
            op: 'POST /route-url',
          }),
        )
      },
    )
  })

  it('falls back to request.raw.url when neither url nor routeOptions.url exist', () => {
    const request = {
      method: 'PUT',
      raw: { url: '/raw-only' },
    }

    Context.run(
      {
        correlationId: 'corr-789',
        ip: '192.168.1.1',
        userAgent: 'agent-y',
      },
      () => {
        createRequestLogger(request, baseLogger)

        expect(baseLogger.child).toHaveBeenCalledWith(
          expect.objectContaining({
            op: 'PUT /raw-only',
          }),
        )
      },
    )
  })

  it('handles missing context gracefully when no Context is active', () => {
    const request = {
      method: 'DELETE',
      url: '/delete',
      raw: { url: '/delete' },
    }

    createRequestLogger(request, baseLogger)

    expect(baseLogger.child).toHaveBeenCalledWith({
      ip: undefined,
      userAgent: undefined,
      correlationId: undefined,
      op: 'DELETE /delete',
    })
  })
})
