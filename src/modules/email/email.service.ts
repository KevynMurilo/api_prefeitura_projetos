import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private verificationEmailTemplate: string;
  private resetPasswordEmailTemplate: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationTemplatePath = path.join(
      process.cwd(),
      'public',
      'verification-email.html',
    );

    const resetPasswordTemplatePath = path.join(
      process.cwd(),
      'public',
      'reset-password-email.html',
    );

    if (fs.existsSync(verificationTemplatePath)) {
      this.verificationEmailTemplate = fs.readFileSync(
        verificationTemplatePath,
        'utf-8',
      );
    } else {
      throw new Error(`File not found: ${verificationTemplatePath}`);
    }

    if (fs.existsSync(resetPasswordTemplatePath)) {
      this.resetPasswordEmailTemplate = fs.readFileSync(
        resetPasswordTemplatePath,
        'utf-8',
      );
    } else {
      throw new Error(`File not found: ${resetPasswordTemplatePath}`);
    }
  }

  async sendVerificationEmail(
    to: string,
    verificationLink: string,
  ): Promise<void> {
    const urlToken = `http://localhost:3000/users/verify?token=${verificationLink}`;

    const htmlEmail = this.verificationEmailTemplate.replace(
      '${verificationLink}',
      urlToken,
    );

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Por favor, verifique seu e-mail',
      html: htmlEmail,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const htmlEmail = this.resetPasswordEmailTemplate.replace(
      '${resetLink}',
      resetLink,
    );

    await this.transporter.sendMail({
      from: 'kevynmurilodev@gmail.com',
      to,
      subject: 'Recuperação de senha',
      html: htmlEmail,
    });
  }
}
