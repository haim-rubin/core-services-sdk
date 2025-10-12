// @ts-nocheck
import httpStatus from 'http-status'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { HttpError } from '../../../src/http/HttpError.js'
import { GENERAL_ERROR } from '../../../src/fastify/error-codes.js'
import {
  replyOnErrorOnly,
  withErrorHandling,
  withErrorHandlingReply,
} from '../../../src/fastify/error-handlers/with-error-handling.js'

describe('withErrorHandling', () => {
  const log = { error: vi.fn() }

  it('should return result on success', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await withErrorHandling(
      log,
      new HttpError(GENERAL_ERROR),
    )(fn)
    expect(result).toBe('ok')
  })

  it('should rethrow HttpError', async () => {
    const err = new HttpError({
      message: 'Bad',
      status: httpStatus.BAD_REQUEST,
    })
    const fn = vi.fn().mockRejectedValue(err)

    await expect(
      withErrorHandling(log, new HttpError(GENERAL_ERROR))(fn),
    ).rejects.toThrow(err)
  })

  it('should wrap non-HttpError with HttpError', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('oops'))

    await expect(
      withErrorHandling(log, new HttpError(GENERAL_ERROR))(fn),
    ).rejects.toBeInstanceOf(HttpError)
  })
})

describe('withErrorHandlingReply', () => {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  }

  const log = { error: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return result on success', async () => {
    const fn = vi.fn().mockResolvedValue('good')
    const result = await withErrorHandlingReply({ reply, log })(fn)
    expect(result).toBe('good')
  })

  it('should send reply on HttpError', async () => {
    const err = new HttpError({
      message: 'not found',
      code: 'NOT_FOUND',
      status: httpStatus.NOT_FOUND,
    })

    const fn = vi.fn().mockRejectedValue(err)
    await withErrorHandlingReply({ reply, log })(fn)

    expect(reply.status).toHaveBeenCalledWith(httpStatus.NOT_FOUND)
    expect(reply.send).toHaveBeenCalledWith({
      code: 'NOT_FOUND',
    })
  })
})

describe('replyOnErrorOnly', () => {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  }

  const log = { error: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return result on success', async () => {
    const fn = vi.fn().mockResolvedValue('yay')
    const result = await replyOnErrorOnly({ reply, log })(fn)
    expect(result).toBe('yay')
  })

  it('should send reply with default error when error is not HttpError', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('bad'))
    await replyOnErrorOnly({ reply, log })(fn)

    expect(reply.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR)
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'bad' }),
    )
  })

  it('should send reply with HttpError if thrown', async () => {
    const err = new HttpError({
      message: 'forbidden',
      code: 'NO_ACCESS',
      status: httpStatus.FORBIDDEN,
    })

    const fn = vi.fn().mockRejectedValue(err)
    await replyOnErrorOnly({ reply, log })(fn)

    expect(reply.status).toHaveBeenCalledWith(httpStatus.FORBIDDEN)
    expect(reply.send).toHaveBeenCalledWith({ error: 'forbidden' })
  })
})
