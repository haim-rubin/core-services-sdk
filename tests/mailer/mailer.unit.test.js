import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockTransport = {
  sendMail: vi.fn(),
}

// Mock the TransportFactory with a spy
vi.mock('../../src/mailer/transport.factory.js', async () => {
  const actual = await vi.importActual('../../src/mailer/transport.factory.js') // fixed path
  return {
    ...actual,
    TransportFactory: {
      create: vi.fn(() => mockTransport),
    },
  }
})

// Mock Mailer class
vi.mock('../../src/mailer/mailer.service.js', async () => {
  const Mailer = vi.fn().mockImplementation((transport) => ({
    send: vi.fn((opts) => transport.sendMail(opts)),
  }))
  return { Mailer }
})

import { initMailer } from '../../src/mailer/index.js'
import { Mailer } from '../../src/mailer/mailer.service.js'
import { TransportFactory } from '../../src/mailer/transport.factory.js'

describe('initMailer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a Mailer instance with correct transport', () => {
    const config = {
      type: 'smtp',
      host: 'host',
      port: 587,
      secure: false,
      auth: { user: 'u', pass: 'p' },
    }

    const mailer = initMailer(config)

    expect(TransportFactory.create).toHaveBeenCalledWith(config)
    expect(Mailer).toHaveBeenCalledWith(mockTransport)

    const emailOptions = {
      to: 'a@b.com',
      subject: 'Test',
      html: '<b>Test</b>',
      from: '"My App" <no-reply@example.com>',
      cc: '',
      bcc: '',
      text: '',
      replyTo: '',
      attachments: '',
    }

    mailer.send(emailOptions)
    expect(mockTransport.sendMail).toHaveBeenCalledWith(emailOptions)
  })
})
