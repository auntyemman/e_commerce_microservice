import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Transporter } from 'nodemailer';

@Processor('NOTIFICATIONS_QUEUE')
export class EmailProcessor extends WorkerHost {
  // constructor(
  //   @Inject('EMAIL_TRANSPORTER') private readonly transporter: Transporter,
  // ) {
  //   super();
  // }
  async process(job: Job) {
    console.log('Start processing job:', job.id);
    console.log('Job name:', job.name);
    switch (job.name) {
      case 'sendVerificationEmail':
        const { mailOptions } = job.data;
        // console.log(this.transporter);
        //await this.transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', mailOptions.to);
    }
  }
  // @Process('sendVerificationEmail')
  // async handleSendVerificationEmail(job: Job) {
  //   try {
  //     console.log('Start processing job:', job.id);
  //     const mailOptions = job.data;
  //     await this.transporter.sendMail(mailOptions);
  //     console.log('Email sent successfully to:', mailOptions.to);
  //   } catch (error) {
  //     console.error('Error processing job:', error);
  //   }
  // }
}
