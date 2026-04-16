import nodemailer from 'nodemailer';
import { config } from '@configs';
import { emailLogger } from '@logger';

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

export class EmailService {
  async sendVerification(email: string, token: string): Promise<void> {
    const verifyUrl = `http://localhost:${config.server.port}/auth/verify-email?token=${token}`;

    await transporter.sendMail({
      from: '"FullToDo" <noreply@fulltodo.dev>',
      to: email,
      subject: 'Подтвердите email',
      html: `
        <p>Для подтверждения email перейдите по ссылке:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>Ссылка действительна 24 часа.</p>
      `,
    });

    emailLogger.info({ email }, 'Sending verification email');
  }

  async sendAccountDeleted(email: string): Promise<void> {
    await transporter.sendMail({
      from: '"FullToDo" <noreply@fulltodo.dev>',
      to: email,
      subject: 'Аккаунт удалён',
      html: `
        <p>Ваш аккаунт был удалён.</p>
        <p>Если это были не вы — немедленно обратитесь в поддержку.</p>
      `,
    });

    emailLogger.info({ email }, 'Sending account deleted email');
  }

  async sendPasswordChanged(email: string): Promise<void> {
    await transporter.sendMail({
      from: '"FullToDo" <noreply@fulltodo.dev>',
      to: email,
      subject: 'Пароль изменён',
      html: `
        <p>Пароль вашего аккаунта был успешно изменён.</p>
        <p>Если это были не вы — немедленно обратитесь в поддержку.</p>
      `,
    });

    emailLogger.info({ email }, 'Sending password changed email');
  }
}
