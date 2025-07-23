export class Mailer {
  /**
   * @param {object} transporter - Nodemailer transporter instance
   */
  constructor(transporter) {
    if (!transporter || typeof transporter.sendMail !== 'function') {
      throw new Error('Invalid transporter')
    }
    this.transporter = transporter
  }

  /**
   * Send an email
   */
  async send({ to, subject, html, text, from, cc, bcc, replyTo, attachments }) {
    return this.transporter.sendMail({
      to,
      cc,
      bcc,
      text,
      from,
      html,
      subject,
      replyTo,
      attachments,
    })
  }
}
