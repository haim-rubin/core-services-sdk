import aws from 'aws-sdk'
import nodemailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'

export class TransportFactory {
  /**
   * @param {object} config
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
