import aws from 'aws-sdk'
import nodemailer from 'nodemailer'
import { describe, it, expect, vi } from 'vitest'
import sgTransport from 'nodemailer-sendgrid-transport'

vi.mock('nodemailer', () => {
  const createTransport = vi.fn((options) => ({
    type: 'mock-transport',
    options,
  }))
  return {
    __esModule: true,
    default: { createTransport },
    createTransport,
  }
})

vi.mock('aws-sdk', () => {
  return {
    __esModule: true,
    default: {
      SES: vi.fn(() => 'mocked-ses'),
    },
  }
})

vi.mock('nodemailer-sendgrid-transport', () => {
  return {
    __esModule: true,
    default: vi.fn((opts) => ({
      sendgrid: true,
      options: opts,
    })),
  }
})

import { TransportFactory } from '../src/mailer/transport.factory.js'
describe('TransportFactory', () => {
  it('should create smtp transport', () => {
    const config = {
      type: 'smtp',
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: { user: 'user', pass: 'pass' },
    }

    const transport = TransportFactory.create(config)
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    })
    expect(transport.type).toBe('mock-transport')
  })

  it('should create gmail transport', () => {
    const config = {
      type: 'gmail',
      auth: { user: 'user@gmail.com', pass: 'pass' },
    }

    const transport = TransportFactory.create(config)
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: config.auth,
    })
    expect(transport.type).toBe('mock-transport')
  })

  it('should create sendgrid transport', () => {
    const config = {
      type: 'sendgrid',
      apiKey: 'SG.xxxx',
    }

    const transport = TransportFactory.create(config)

    expect(nodemailer.createTransport).toHaveBeenCalled()

    const args = nodemailer.createTransport.mock.calls[0][0]

    expect(args).toEqual({
      sendgrid: true,
      options: {
        auth: { api_key: config.apiKey },
      },
    })

    expect(transport).toEqual({
      type: 'mock-transport',
      options: {
        sendgrid: true,
        options: {
          auth: { api_key: config.apiKey },
        },
      },
    })
  })

  it('should create ses transport', () => {
    const config = {
      type: 'ses',
      accessKeyId: 'AKIA...',
      secretAccessKey: 'secret',
      region: 'us-west-2',
    }

    TransportFactory.create(config)

    expect(nodemailer.createTransport).toHaveBeenCalled()
    const args = nodemailer.createTransport.mock.calls[0][0]

    expect(args).toEqual({
      SES: {
        ses: 'mocked-ses',
        aws: expect.anything(),
      },
    })
  })

  it('should throw error for unsupported type', () => {
    expect(() => {
      TransportFactory.create({ type: 'unsupported' })
    }).toThrow('Unsupported transport type: unsupported')
  })
})
