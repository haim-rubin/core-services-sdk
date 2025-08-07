import nodemailer from 'nodemailer'
import { describe, it, expect, beforeAll } from 'vitest'

import { Mailer } from '../../src/mailer/mailer.service.js'

describe('Mailer (integration)', () => {
  let transporter
  let mailer
  let testAccount

  beforeAll(async () => {
    testAccount = await nodemailer.createTestAccount()

    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    mailer = new Mailer(transporter)
  })

  it('should send email with HTML + text', async () => {
    const result = await mailer.send({
      to: 'recipient@example.com',
      from: '"My App" <no-reply@example.com>',
      subject: 'Integration Test: HTML + text',
      text: 'Hello from plain text',
      html: '<strong>Hello HTML</strong>',
      cc: '',
      bcc: '',
      replyTo: '',
      attachments: '',
    })

    expect(result.messageId).toBeDefined()
    expect(result.envelope).toBeDefined()
    expect(result.accepted).toContain('recipient@example.com')

    const previewUrl = nodemailer.getTestMessageUrl(result)
    console.log(`📨 Preview (HTML+text): ${previewUrl}`)
    expect(previewUrl).toMatch(/^https:\/\/ethereal\.email/)
  })

  it('should send HTML-only email', async () => {
    const result = await mailer.send({
      to: 'recipient2@example.com',
      from: '"My App" <no-reply@example.com>',
      subject: 'Integration Test: HTML only',
      html: '<h2>Only HTML</h2>',
      cc: '',
      bcc: '',
      text: '',
      replyTo: '',
      attachments: '',
    })

    expect(result.messageId).toBeDefined()
    expect(result.accepted).toContain('recipient2@example.com')

    const previewUrl = nodemailer.getTestMessageUrl(result)
    console.log(`📨 Preview (HTML only): ${previewUrl}`)
    expect(previewUrl).toMatch(/^https:\/\/ethereal\.email/)
  })

  it('should send email with attachment', async () => {
    const result = await mailer.send({
      to: 'recipient3@example.com',
      from: '"My App" <no-reply@example.com>',
      subject: 'Integration Test: With Attachment',
      text: 'See attached file.',
      html: '<p>See attached file.</p>',
      attachments: [
        {
          filename: 'test.txt',
          content: 'This is the content of the attachment.',
        },
      ],
      cc: '',
      bcc: '',
      replyTo: '',
    })

    expect(result.messageId).toBeDefined()
    expect(result.accepted).toContain('recipient3@example.com')

    const previewUrl = nodemailer.getTestMessageUrl(result)
    console.log(`📨 Preview (With Attachment): ${previewUrl}`)
    expect(previewUrl).toMatch(/^https:\/\/ethereal\.email/)
  })
})
