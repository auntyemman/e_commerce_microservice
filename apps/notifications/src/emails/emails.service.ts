import { Inject, Injectable } from '@nestjs/common';
import { SendMailOptions, Transporter } from 'nodemailer';

import { emailVerificationTemplate } from './template/user_email_verification';
import { ConfigService } from '@nestjs/config';
import { FRONTEND_BASEURL } from '../utils';
// import { transporter } from '../../../config/nodeMailer';

@Injectable()
export class EmailsService {
  constructor(
    @Inject('EMAIL_TRANSPORTER') private readonly transporter: Transporter,
    private readonly configService: ConfigService,
  ) {}

  async emailVerification(user: any) {
    const link = `${FRONTEND_BASEURL}/verify`;
    const processedHTML = emailVerificationTemplate(user.username, link);
    const mailOptions: SendMailOptions = {
      from: `Jumga ${this.configService.get<string>('EMAIL_USER')}`,
      to: user.email,
      subject: 'Verify your account',
      html: processedHTML,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      // console.log(`Email sent: ${info.messageId}`);
      // return info;
    } catch (error) {
      // console.error(`Error sending email: ${error.message}`);
      throw new Error('Failed to send email');
    }

  }
}
