export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<void>;
}
