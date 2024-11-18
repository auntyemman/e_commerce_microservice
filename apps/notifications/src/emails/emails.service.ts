import { Inject, Injectable } from '@nestjs/common';
import { SendMailOptions, Transporter } from 'nodemailer';

import { emailVerificationTemplate } from './template/user_email_verification';
import { ConfigService } from '@nestjs/config';
import { FRONTEND_BASEURL } from '../utils';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class EmailsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('NOTIFICATIONS_QUEUE') private readonly emailQueue: Queue,
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
      console.log(`Email about to be added to emailQueue`);
      const job = await this.emailQueue.add(
        'sendVerificationEmail',
        mailOptions,
        {
        // attempts: 5, // no of attempts
        // backoff: { type: 'exponential', delay: 1000 },
      });
      console.log(`waiting to be processed: `, job.id);
      // await this.transporter.sendMail(mailOptions);
      // console.log(`Email sent: ${info.messageId}`);
      // return info;
    } catch (error) {
      console.error(`Error sending email: ${error.message}`, error);
      throw new Error('Failed to send email');
    }

  }
}
