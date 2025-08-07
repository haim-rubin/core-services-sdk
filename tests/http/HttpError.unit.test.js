import httpStatus from 'http-status'
import { describe, it, expect } from 'vitest'

import { HttpError } from '../../src/http/HttpError.js'

describe('HttpError', () => {
  it('should create an instance with custom message, code, and extendInfo', () => {
    const error = new HttpError({
      code: 'INVALID_INPUT',
      message: 'Invalid input provided',
      httpStatusCode: 400,
      extendInfo: { field: 'email', reason: 'missing' },
    })

    expect(error).toBeInstanceOf(HttpError)
    expect(error.message).toBe('Invalid input provided')
    expect(error.code).toBe('INVALID_INPUT')
    expect(error.httpStatusCode).toBe(400)
    expect(error.httpStatusText).toBe(httpStatus[400])
    expect(error.extendInfo).toEqual({ field: 'email', reason: 'missing' })
  })

  it('should fallback to default message from status if message is missing', () => {
    const error = new HttpError({
      code: 'BAD_REQUEST',
      httpStatusCode: 400,
    })

    expect(error.message).toBe(httpStatus[400])
    expect(error.httpStatusText).toBe(httpStatus[400])
    expect(error.extendInfo).toBeUndefined()
  })

  it('should fallback to code as message if message and status code missing', () => {
    const error = new HttpError({ code: 'ERROR_CODE_ONLY' })

    expect(error.message).toBe('ERROR_CODE_ONLY')
    expect(error.httpStatusCode).toBeUndefined()
    expect(error.extendInfo).toBeUndefined()
  })

  it('should fallback to "Unknown error" if no data provided', () => {
    const error = new HttpError()

    expect(error.message).toBe('Unknown error')
    expect(error.extendInfo).toBeUndefined()
  })

  it('should return correct JSON representation without extendInfo', () => {
    const error = new HttpError({
      code: 'NOT_FOUND',
      message: 'Resource not found',
      httpStatusCode: 404,
    })

    expect(error.toJSON()).toEqual({
      code: 'NOT_FOUND',
      message: 'Resource not found',
      httpStatusCode: 404,
      httpStatusText: httpStatus[404],
    })
  })

  it('should return correct JSON representation with extendInfo', () => {
    const error = new HttpError({
      code: 'NOT_FOUND',
      message: 'Resource not found',
      httpStatusCode: 404,
      extendInfo: { resource: 'user', id: 123 },
    })

    expect(error.toJSON()).toEqual({
      code: 'NOT_FOUND',
      message: 'Resource not found',
      httpStatusCode: 404,
      httpStatusText: httpStatus[404],
      extendInfo: { resource: 'user', id: 123 },
    })
  })

  it('should detect instance using isHttpError', () => {
    const error = new HttpError({
      code: 'TEST',
      httpStatusCode: 500,
    })

    expect(HttpError.isHttpError(error)).toBe(true)
    expect(HttpError.isHttpError(new Error('x'))).toBe(false)
  })

  it('FromError should return same instance if already HttpError', () => {
    const original = new HttpError({
      code: 'ALREADY_HTTP',
      httpStatusCode: 401,
    })
    const result = HttpError.FromError(original)

    expect(result).toBe(original)
  })

  it('FromError should wrap generic Error', () => {
    const err = new Error('Boom!')
    const httpError = HttpError.FromError(err)

    expect(httpError).toBeInstanceOf(HttpError)
    expect(httpError.message).toBe('Boom!')
    expect(httpError.code).toBe('UNHANDLED_ERROR')
    expect(httpError.httpStatusCode).toBe(500)
    expect(httpError.httpStatusText).toBe(httpStatus[500])
    expect(httpError.extendInfo).toBeUndefined()
  })
})
