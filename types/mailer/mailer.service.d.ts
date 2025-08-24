export class Mailer {
    /**
     * @param {object} transporter - Nodemailer transporter instance
     */
    constructor(transporter: object);
    transporter: any;
    /**
     * Send an email
     */
    send({ to, subject, html, text, from, cc, bcc, replyTo, attachments }: {
        to: any;
        subject: any;
        html: any;
        text: any;
        from: any;
        cc: any;
        bcc: any;
        replyTo: any;
        attachments: any;
    }): Promise<any>;
}
