import nodemailer from 'nodemailer'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ===================
// SAFELY MOCK MODULES
// ===================

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

vi.mock('nodemailer-sendgrid-transport', () => ({
  __esModule: true,
  default: vi.fn((opts) => ({
    sendgrid: true,
    options: opts,
  })),
}))

vi.mock('@aws-sdk/client-ses', () => {
  const mockSesInstance = { mocked: true } // consistent reference
  const sesClient = vi.fn(() => mockSesInstance)

  globalThis.__mockedSesClient__ = sesClient
  globalThis.__mockedSesInstance__ = mockSesInstance

  return {
    SESClient: sesClient,
    SendRawEmailCommand: 'mocked-command',
  }
})

vi.mock('@aws-sdk/credential-provider-node', () => {
  const defaultProvider = vi.fn(() => 'mocked-default-provider')
  globalThis.__mockedDefaultProvider__ = defaultProvider
  return {
    defaultProvider,
  }
})

// ==========================
// NOW IMPORT MODULE UNDER TEST
// ==========================

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

    // @ts-ignore
    const transport = TransportFactory.create(config)

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    })

    // @ts-ignore
    expect(transport.type).toBe('mock-transport')
  })

  it('should create gmail transport', () => {
    const config = {
      type: 'gmail',
      auth: { user: 'user@gmail.com', pass: 'pass' },
    }

    // @ts-ignore
    const transport = TransportFactory.create(config)

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: config.auth,
    })

    // @ts-ignore
    expect(transport.type).toBe('mock-transport')
  })

  it('should create sendgrid transport', () => {
    const config = {
      type: 'sendgrid',
      apiKey: 'SG.xxxx',
    }

    // @ts-ignore
    const transport = TransportFactory.create(config)

    // @ts-ignore
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

  it('should create ses transport with credentials', () => {
    const config = {
      type: 'ses',
      accessKeyId: 'AKIA...',
      secretAccessKey: 'secret',
      region: 'us-west-2',
    }

    // @ts-ignore
    const transport = TransportFactory.create(config)

    expect(globalThis.__mockedSesClient__).toHaveBeenCalledWith({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })

    // @ts-ignore
    const args = nodemailer.createTransport.mock.calls[0][0]

    expect(args).toEqual({
      SES: {
        ses: globalThis.__mockedSesInstance__,
        aws: {
          SendRawEmailCommand: 'mocked-command',
        },
      },
    })

    // @ts-ignore
    expect(transport.type).toBe('mock-transport')
  })

  it('should create ses transport with defaultProvider fallback', () => {
    const config = {
      type: 'ses',
      region: 'us-east-1',
    }

    // @ts-ignore
    const transport = TransportFactory.create(config)

    expect(globalThis.__mockedDefaultProvider__).toHaveBeenCalled()

    expect(globalThis.__mockedSesClient__).toHaveBeenCalledWith({
      region: config.region,
      credentials: 'mocked-default-provider',
    })

    // @ts-ignore
    const args = nodemailer.createTransport.mock.calls[0][0]

    expect(args).toEqual({
      SES: {
        ses: globalThis.__mockedSesInstance__,
        aws: {
          SendRawEmailCommand: 'mocked-command',
        },
      },
    })

    // @ts-ignore
    expect(transport.type).toBe('mock-transport')
  })

  it('should throw error for unsupported type', () => {
    expect(() => {
      // @ts-ignore
      TransportFactory.create({ type: 'invalid' })
    }).toThrow('Unsupported transport type: invalid')
  })
})
