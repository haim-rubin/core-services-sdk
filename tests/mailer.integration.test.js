import { describe, it, expect } from 'vitest'
import nodemailer from 'nodemailer'
import { Mailer } from '../src/mailer/mailer.service.js'

describe('Mailer (integration)', () => {
  it('should send email using ethereal SMTP', async () => {
    // Create ethereal test account
    const testAccount = await nodemailer.createTestAccount()

    // Create Nodemailer transporter for ethereal
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    // Create Mailer instance
    const mailer = new Mailer(transporter)

    // Send test email
    const result = await mailer.send({
      to: 'recipient@example.com',
      text: 'Hello from test - plain text',
      from: '"My App" <no-reply@example.com>',
      subject: 'core-service-sdk:Integration Test Email',
      html: '<h1>Hello from core-service-sdk test</h1><p>This is a core-service-sdk</p>',
      cc: '',
      bcc: '',
      replyTo: '',
      attachments: '',
    })

    // Assert response
    expect(result.messageId).toBeDefined()

    // Print preview URL (clickable in terminal)
    const previewUrl = nodemailer.getTestMessageUrl(result)
    console.log(`📨 Preview this email: ${previewUrl}`)

    expect(previewUrl).toMatch(/^https:\/\/ethereal\.email/)
  })
})
