import aws from 'aws-sdk'
import nodemailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'

/**
 * Factory for creating Nodemailer transporters based on configuration.
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
   * @returns {import('nodemailer').Transporter}
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
        return nodemailer.createTransport(
          sgTransport({
            auth: { api_key: config.apiKey },
          }),
        )

      case 'ses':
        const ses = new aws.SES({
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
          region: config.region,
        })
        return nodemailer.createTransport({ SES: { ses, aws } })

      default:
        throw new Error(`Unsupported transport type: ${config.type}`)
    }
  }
}
