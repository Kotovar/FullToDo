import { render } from '@react-email/render';
import { config } from '@configs';
import { emailLogger } from '@logger';
import { ROUTES } from '@sharedCommon/routes';
import VerificationEmail from '../emails/VerificationEmail';
import PasswordChangedEmail from '../emails/PasswordChangedEmail';
import AccountDeletedEmail from '../emails/AccountDeletedEmail';
import PasswordResetEmail from '../emails/PasswordResetEmail';
import { createEmailProvider } from './emailProviders';
import type { EmailProvider } from './emailProviders';

export class EmailService {
  constructor(private emailProvider: EmailProvider = createEmailProvider()) {}

  async sendVerification(email: string, token: string): Promise<void> {
    const verifyUrl = `${config.corsOrigin}${ROUTES.app.verifyEmail}?token=${token}`;
    const html = await render(VerificationEmail({ verifyUrl }));

    await this.emailProvider.sendEmail({
      to: email,
      subject: 'Подтвердите email — FullToDo',
      html,
    });

    emailLogger.info(
      { email, provider: config.email.provider },
      'Sending verification email',
    );
  }

  async sendPasswordChanged(email: string): Promise<void> {
    const html = await render(PasswordChangedEmail({ email }));

    await this.emailProvider.sendEmail({
      to: email,
      subject: 'Пароль изменён — FullToDo',
      html,
    });

    emailLogger.info(
      { email, provider: config.email.provider },
      'Sending password changed email',
    );
  }

  async sendAccountDeleted(email: string): Promise<void> {
    const html = await render(AccountDeletedEmail({ email }));

    await this.emailProvider.sendEmail({
      to: email,
      subject: 'Аккаунт удалён — FullToDo',
      html,
    });

    emailLogger.info(
      { email, provider: config.email.provider },
      'Sending account deleted email',
    );
  }

  async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
    const html = await render(PasswordResetEmail({ resetUrl }));

    await this.emailProvider.sendEmail({
      to: email,
      subject: 'Сброс пароля — FullToDo',
      html,
    });

    emailLogger.info(
      { email, provider: config.email.provider },
      'Sending password reset email',
    );
  }
}
