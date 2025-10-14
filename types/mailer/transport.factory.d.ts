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
  static create(config: {
    type: 'smtp' | 'gmail' | 'sendgrid' | 'ses'
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
    auth: {
      user: string
      pass: string
    }
    apiKey: string
    accessKeyId: string
    secretAccessKey: string
    region: string
  }): any | typeof import('@sendgrid/mail')
}
