// @ts-nocheck
import nodemailer from 'nodemailer'

import { describe, it, expect, vi, beforeEach } from 'vitest'

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

vi.mock('@sendgrid/mail', () => {
  const setApiKey = vi.fn()
  const send = vi.fn()
  const sgMail = { setApiKey, send }
  globalThis.__mockedSgMail__ = sgMail
  return {
    __esModule: true,
    default: sgMail,
  }
})

vi.mock('@aws-sdk/client-ses', () => {
  const mockSesInstance = { mocked: true }
  const SESClient = vi.fn(() => mockSesInstance)
  globalThis.__mockedSesClient__ = SESClient
  globalThis.__mockedSesInstance__ = mockSesInstance
  return {
    SESClient,
    SendRawEmailCommand: 'mocked-command',
  }
})

vi.mock('@aws-sdk/credential-provider-node', () => {
  const defaultProvider = vi.fn(() => 'mocked-default-provider')
  globalThis.__mockedDefaultProvider__ = defaultProvider
  return { defaultProvider }
})

import { TransportFactory } from '../../src/mailer/transport.factory.js'

describe('TransportFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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
      apiKey: 'SG.key',
    }

    const transport = TransportFactory.create(config)

    expect(globalThis.__mockedSgMail__.setApiKey).toHaveBeenCalledWith(
      config.apiKey,
    )
    expect(transport).toEqual(globalThis.__mockedSgMail__)
  })

  it('should throw if sendgrid API key is missing', () => {
    expect(() => {
      TransportFactory.create({ type: 'sendgrid' })
    }).toThrow('Missing SendGrid API key')
  })

  it('should create ses transport with credentials', () => {
    const config = {
      type: 'ses',
      accessKeyId: 'AKIA...',
      secretAccessKey: 'secret',
      region: 'us-west-2',
    }

    const transport = TransportFactory.create(config)

    expect(globalThis.__mockedSesClient__).toHaveBeenCalledWith({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })

    const args = nodemailer.createTransport.mock.calls[0][0]
    expect(args).toEqual({
      SES: {
        ses: globalThis.__mockedSesInstance__,
        aws: { SendRawEmailCommand: 'mocked-command' },
      },
    })

    expect(transport.type).toBe('mock-transport')
  })

  it('should create ses transport with defaultProvider fallback', () => {
    const config = {
      type: 'ses',
      region: 'us-east-1',
    }

    const transport = TransportFactory.create(config)

    expect(globalThis.__mockedDefaultProvider__).toHaveBeenCalled()
    expect(globalThis.__mockedSesClient__).toHaveBeenCalledWith({
      region: config.region,
      credentials: 'mocked-default-provider',
    })

    const args = nodemailer.createTransport.mock.calls[0][0]
    expect(args).toEqual({
      SES: {
        ses: globalThis.__mockedSesInstance__,
        aws: { SendRawEmailCommand: 'mocked-command' },
      },
    })

    expect(transport.type).toBe('mock-transport')
  })

  it('should throw error for unsupported type', () => {
    expect(() => {
      TransportFactory.create({ type: 'invalid' })
    }).toThrow('Unsupported transport type: invalid')
  })
})
