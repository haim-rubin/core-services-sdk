import httpStatus from 'http-status'
import { describe, it, expect } from 'vitest'

import { HttpError } from '../../src/http/HttpError.js'

describe('HttpError', () => {
  it('should create an instance with custom message, code, and extendInfo', () => {
    const error = new HttpError({
      code: 'INVALID_INPUT',
      message: 'Invalid input provided',
      status: httpStatus.BAD_REQUEST,
      extendInfo: { field: 'email', reason: 'missing' },
    })

    expect(error).toBeInstanceOf(HttpError)
    expect(error.message).toBe('Invalid input provided')
    expect(error.code).toBe('INVALID_INPUT')
    expect(error.status).toBe(httpStatus.BAD_REQUEST)
    expect(error.extendInfo).toEqual({ field: 'email', reason: 'missing' })
  })

  it('should fallback to default message from status if message is missing', () => {
    const error = new HttpError({
      code: 'BAD_REQUEST',
      status: httpStatus.BAD_REQUEST,
    })

    expect(error.message).toBe(httpStatus[httpStatus.BAD_REQUEST])
    expect(error.extendInfo).toBeUndefined()
  })

  it('should fallback to code as message if message and status code missing', () => {
    const error = new HttpError({ code: 'ERROR_CODE_ONLY' })

    expect(error.message).toBe('ERROR_CODE_ONLY')
    expect(error.status).toBeUndefined()
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
      status: httpStatus.NOT_FOUND,
    })

    expect(error.toJSON()).toEqual({
      code: 'NOT_FOUND',
      message: 'Resource not found',
      status: httpStatus.NOT_FOUND,
    })
  })

  it('should return correct JSON representation with extendInfo', () => {
    const error = new HttpError({
      code: 'NOT_FOUND',
      message: 'Resource not found',
      status: httpStatus.NOT_FOUND,
      extendInfo: { resource: 'user', id: 123 },
    })

    expect(error.toJSON()).toEqual({
      code: 'NOT_FOUND',
      message: 'Resource not found',
      status: httpStatus.NOT_FOUND,
      extendInfo: { resource: 'user', id: 123 },
    })
  })

  it('should detect instance using isHttpError', () => {
    const error = new HttpError({
      code: 'TEST',
      status: httpStatus.INTERNAL_SERVER_ERROR,
    })

    expect(HttpError.isHttpError(error)).toBe(true)
    expect(HttpError.isHttpError(new Error('x'))).toBe(false)
  })

  it('FromError should return same instance if already HttpError', () => {
    const original = new HttpError({
      code: 'ALREADY_HTTP',
      status: httpStatus.UNAUTHORIZED,
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
    expect(httpError.status).toBe(httpStatus.INTERNAL_SERVER_ERROR)

    expect(httpError.extendInfo).toBeUndefined()
  })
})
