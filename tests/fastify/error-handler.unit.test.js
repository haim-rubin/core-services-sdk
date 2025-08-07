import httpStatus from 'http-status'
import { describe, it, expect } from 'vitest'

import { GENERAL_ERROR } from '../../src/fastify/error-codes.js'

describe('GENERAL_ERROR', () => {
  it('should have correct status code', () => {
    expect(GENERAL_ERROR.httpStatusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR)
  })

  it('should have correct status text', () => {
    expect(GENERAL_ERROR.httpStatusText).toBe(
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    )
  })

  it('should have correct code format', () => {
    const expectedCode = `GENERAL.${
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    }`
    expect(GENERAL_ERROR.code).toBe(expectedCode)
  })

  it('should have all required properties and types', () => {
    expect(typeof GENERAL_ERROR.httpStatusCode).toBe('number')
    expect(typeof GENERAL_ERROR.httpStatusText).toBe('string')
    expect(typeof GENERAL_ERROR.code).toBe('string')
  })

  it('should match full expected structure', () => {
    const expected = {
      httpStatusCode: 500,
      httpStatusText: 'Internal Server Error',
      code: 'GENERAL.Internal Server Error',
    }

    expect(GENERAL_ERROR).toEqual(expected)
  })
})
