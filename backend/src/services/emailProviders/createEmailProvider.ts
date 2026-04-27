import { config } from '@configs';
import { MailtrapEmailProvider } from './MailtrapEmailProvider';
import { ResendEmailProvider } from './ResendEmailProvider';
import type { EmailProvider } from './types';

const requireConfigValue = (
  value: string | undefined,
  name: string,
): string => {
  if (!value) {
    throw new Error(
      `${name} is required for ${config.email.provider} email provider`,
    );
  }

  return value;
};

export const createEmailProvider = (): EmailProvider => {
  switch (config.email.provider) {
    case 'mailtrap':
      return new MailtrapEmailProvider({
        user: requireConfigValue(config.smtp.user, 'MAILTRAP_USER'),
        pass: requireConfigValue(config.smtp.pass, 'MAILTRAP_PASS'),
        from: config.email.from,
      });
    case 'resend':
      return new ResendEmailProvider({
        apiKey: requireConfigValue(config.resend.apiKey, 'RESEND_API_KEY'),
        from: config.email.from,
      });
  }
};
