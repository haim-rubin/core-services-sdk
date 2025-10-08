import nodemailer from 'nodemailer'
import sgMail from '@sendgrid/mail'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

/**
 * Factory for creating email transporters based on configuration.
 */
export class TransportFactory {
  /**
   * Create a Nodemailer transporter
   *
   * @param {object} config - Transport configuration object
   * @param {'smtp' | 'gmail' | 'sendgrid' | 'ses'} config.type - Type of email transport
   *
   * For type 'smtp':
   * @param {string} config.host - SMTP server host
   * @param {number} config.port - SMTP server port
   * @param {boolean} config.secure - Use TLS
   * @param {{ user: string, pass: string }} config.auth - SMTP auth credentials
   *
   * For type 'gmail':
   * @param {{ user: string, pass: string }} config.auth - Gmail credentials
   *
   * For type 'sendgrid':
   * @param {string} config.apiKey - SendGrid API key
   *
   * For type 'ses':
   * @param {string} config.accessKeyId - AWS access key
   * @param {string} config.secretAccessKey - AWS secret
   * @param {string} config.region - AWS region
   *
   * @returns {import('nodemailer').Transporter | typeof import('@sendgrid/mail')}
   */

  static create(config) {
    switch (config.type) {
      case 'smtp':
        return nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: config.auth,
        })

      case 'gmail':
        return nodemailer.createTransport({
          service: 'gmail',
          auth: config.auth,
        })

      case 'sendgrid':
        if (!config.apiKey) {
          throw new Error('Missing SendGrid API key')
        }
        sgMail.setApiKey(config.apiKey)
        return sgMail // Not a Nodemailer transport, but SendGrid's mail API

      case 'ses': {
        const sesClient = new SESv2Client({
          region: config.region,
          credentials:
            config.accessKeyId && config.secretAccessKey
              ? {
                  accessKeyId: config.accessKeyId,
                  secretAccessKey: config.secretAccessKey,
                }
              : defaultProvider(),
        })

        return nodemailer.createTransport({
          SES: {
            sesClient,
            SendEmailCommand,
          },
        })
      }

      default:
        throw new Error(`Unsupported transport type: ${config.type}`)
    }
  }
}
