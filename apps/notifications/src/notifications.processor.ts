// import { Processor, Process } from '@nestjs/bull';
// import { Inject } from '@nestjs/common';
// import { Job } from 'bullmq';
// import { Transporter } from 'nodemailer';

// @Processor('NOTIFICATIONS_QUEUE')
// export class NotificationProcessor {
//   constructor(
//     @Inject('EMAIL_TRANSPORTER') private readonly transporter: Transporter,
//   ) {}
//   @Process('send_verification_email')
//   async handleSendVerificationEmail(job: Job) {
//     const mailOptions = job.data;
//     console.log('processing');
//     await this.transporter.sendMail(mailOptions);
//     console.log('sent welcome email to:', mailOptions);
//   }
// }
