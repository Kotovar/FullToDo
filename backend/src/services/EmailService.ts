import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { config } from '@configs';
import { emailLogger } from '@logger';
import VerificationEmail from '../emails/VerificationEmail';
import PasswordChangedEmail from '../emails/PasswordChangedEmail';
import AccountDeletedEmail from '../emails/AccountDeletedEmail';

const HOST = 'sandbox.smtp.mailtrap.io';
const PORT = 2525;

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

const buildMail = (to: string, subject: string, html: string) => ({
  from: '"FullToDo" <noreply@fulltodo.dev>',
  to,
  subject,
  html,
});

export class EmailService {
  async sendVerification(email: string, token: string): Promise<void> {
    const verifyUrl = `http://localhost:${config.server.port}/auth/verify-email?token=${token}`;
    const html = await render(VerificationEmail({ verifyUrl }));

    await transporter.sendMail(
      buildMail(email, 'Подтвердите email — FullToDo', html),
    );

    emailLogger.info({ email }, 'Sending verification email');
  }

  async sendPasswordChanged(email: string): Promise<void> {
    const html = await render(PasswordChangedEmail({ email }));

    await transporter.sendMail(
      buildMail(email, 'Пароль изменён — FullToDo', html),
    );

    emailLogger.info({ email }, 'Sending password changed email');
  }

  async sendAccountDeleted(email: string): Promise<void> {
    const html = await render(AccountDeletedEmail({ email }));

    await transporter.sendMail(
      buildMail(email, 'Аккаунт удалён — FullToDo', html),
    );

    emailLogger.info({ email }, 'Sending account deleted email');
  }
}
