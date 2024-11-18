import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { EmailsController } from './emails.controller';
import { AuthModule, BullMQModule, RmqModule } from '@app/common';
import { NOTIFICATIONS_SERVICE } from '../utils';
import { getQueueToken } from '@nestjs/bull';
import { EmailProcessor } from './emails.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    RmqModule.register({
      name: NOTIFICATIONS_SERVICE, // Ensure this matches what is used in users service
    }),
    // BullMQModule.register('NOTIFICATIONS_QUEUE'),
    BullModule.registerQueue({
      name: 'NOTIFICATIONS_QUEUE',
      connection: {
        port: 6379,
      },
    }),

  ],
  controllers: [EmailsController],
  providers: [
    EmailsService,
    EmailProcessor,
    {
      provide: 'EMAIL_TRANSPORTER',
      useFactory: async (configService: ConfigService) => {
        return createTransport({
          service: 'gmail',
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        });
      },
      inject: [ConfigService],
    },
    // {
    //   provide: 'NOTIFICATIONS_QUEUE',
    //   useExisting: getQueueToken('NOTIFICATIONS_QUEUE'), // Dynamically reference the correct queue token
    // },
  ],
  exports: [EmailsService, EmailProcessor],
})
export class EmailsModule {}
