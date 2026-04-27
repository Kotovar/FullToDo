import { Resend } from 'resend';
import type { EmailProvider, SendEmailParams } from './types';

type ResendEmailProviderConfig = {
  apiKey: string;
  from: string;
};

export class ResendEmailProvider implements EmailProvider {
  private resend: Resend;

  constructor(private config: ResendEmailProviderConfig) {
    this.resend = new Resend(config.apiKey);
  }

  async sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.config.from,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}
