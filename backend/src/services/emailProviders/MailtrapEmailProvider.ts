import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { EmailProvider, SendEmailParams } from './types';

const HOST = 'sandbox.smtp.mailtrap.io';
const PORT = 2525;

type MailtrapEmailProviderConfig = {
  user: string;
  pass: string;
  from: string;
};

export class MailtrapEmailProvider implements EmailProvider {
  private transporter: Transporter;

  constructor(private config: MailtrapEmailProviderConfig) {
    this.transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.from,
      to,
      subject,
      html,
    });
  }
}
