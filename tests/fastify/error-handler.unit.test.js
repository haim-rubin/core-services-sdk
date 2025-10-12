import httpStatus from 'http-status'
import { describe, it, expect } from 'vitest'

import { GENERAL_ERROR } from '../../src/fastify/error-codes.js'

describe('GENERAL_ERROR', () => {
  it('should have correct status code', () => {
    expect(GENERAL_ERROR.status).toBe(httpStatus.INTERNAL_SERVER_ERROR)
  })

  it('should have correct code format', () => {
    const expectedCode = `GENERAL.${
      httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    }`
    expect(GENERAL_ERROR.code).toBe(expectedCode)
  })

  it('should have all required properties and types', () => {
    expect(typeof GENERAL_ERROR.status).toBe('number')
    expect(typeof GENERAL_ERROR.code).toBe('string')
  })

  it('should match full expected structure', () => {
    const expected = {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      code: 'GENERAL.Internal Server Error',
    }

    expect(GENERAL_ERROR).toEqual(expected)
  })
})
