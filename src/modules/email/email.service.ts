import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private verificationEmailTemplate: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const templatePath = path.join(
      process.cwd(),
      'public',
      'verification-email.html',
    );

    if (fs.existsSync(templatePath)) {
      this.verificationEmailTemplate = fs.readFileSync(templatePath, 'utf-8');
    } else {
      throw new Error(`File not found: ${templatePath}`);
    }
  }

  async sendVerificationEmail(
    to: string,
    verificationLink: string,
  ): Promise<void> {
    const htmlEmail = this.verificationEmailTemplate.replace(
      '${verificationLink}',
      verificationLink,
    );

    await this.transporter.sendMail({
      from: process.env.USER_EMAIL,
      to,
      subject: 'Por favor, verifique seu e-mail',
      html: htmlEmail,
    });
  }
}
