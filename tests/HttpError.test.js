import { describe, it, expect } from 'vitest'
import { HttpError } from '../src/http/HttpError.js'
import httpStatus from 'http-status'

describe('HttpError', () => {
  it('creates an error with all fields explicitly set', () => {
    const err = new HttpError({
      code: 'SOME_ERROR',
      message: 'Something went wrong',
      httpStatusCode: httpStatus.BAD_REQUEST,
      httpStatusText: httpStatus[httpStatus.BAD_REQUEST],
    })

    expect(err).toBeInstanceOf(HttpError)
    expect(err.message).toBe('Something went wrong')
    expect(err.code).toBe('SOME_ERROR')
    expect(err.httpStatusCode).toBe(httpStatus.BAD_REQUEST)
    expect(err.httpStatusText).toBe(httpStatus[httpStatus.BAD_REQUEST])
  })

  it('falls back to code if message and httpStatusCode are missing', () => {
    const err = new HttpError({ code: 'MY_CODE' })
    expect(err.message).toBe('MY_CODE')
    expect(err.code).toBe('MY_CODE')
  })

  it('falls back to status text if only httpStatusCode is provided', () => {
    const err = new HttpError({ httpStatusCode: httpStatus.NOT_FOUND })
    expect(err.message).toBe(httpStatus[httpStatus.NOT_FOUND])
    expect(err.httpStatusText).toBe(httpStatus[httpStatus.NOT_FOUND])
    expect(err.httpStatusCode).toBe(httpStatus.NOT_FOUND)
  })

  it('falls back to "Unknown error" if nothing is provided', () => {
    const err = new HttpError()
    expect(err.message).toBe('Unknown error')
    expect(err.code).toBeUndefined()
    expect(err.httpStatusCode).toBeUndefined()
    expect(err.httpStatusText).toBeUndefined()
  })

  it('uses httpStatusText if not explicitly set but httpStatusCode is present', () => {
    const err = new HttpError({ httpStatusCode: httpStatus.UNAUTHORIZED })
    expect(err.httpStatusText).toBe(httpStatus[httpStatus.UNAUTHORIZED])
  })

  it('supports static isInstanceOf check', () => {
    const err = new HttpError()
    expect(HttpError.isInstanceOf(err)).toBe(true)
    expect(HttpError.isInstanceOf(new Error())).toBe(false)
  })

  it('supports Symbol.hasInstance (dynamic instanceof)', () => {
    const fake = {
      code: 'FAKE',
      message: 'Fake error',
      httpStatusCode: httpStatus.UNAUTHORIZED,
      httpStatusText: httpStatus[httpStatus.UNAUTHORIZED],
    }

    expect(fake instanceof HttpError).toBe(true)
  })

  it('serializes correctly via toJSON', () => {
    const err = new HttpError({
      code: 'TOO_FAST',
      message: 'You are too fast',
      httpStatusCode: httpStatus.TOO_MANY_REQUESTS,
      httpStatusText: httpStatus[httpStatus.TOO_MANY_REQUESTS],
    })

    const json = JSON.stringify(err)
    expect(JSON.parse(json)).toEqual({
      code: 'TOO_FAST',
      message: 'You are too fast',
      httpStatusCode: httpStatus.TOO_MANY_REQUESTS,
      httpStatusText: httpStatus[httpStatus.TOO_MANY_REQUESTS],
    })
  })
})
