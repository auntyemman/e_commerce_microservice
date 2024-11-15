import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { EmailsController } from './emails.controller';
import { AuthModule, RmqModule } from '@app/common';
import { NOTIFICATIONS_SERVICE } from '../utils';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    RmqModule.register({
      name: NOTIFICATIONS_SERVICE, // Ensure this matches what is used in users service
    }),
  ],
  controllers: [EmailsController],
  providers: [
    EmailsService,
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
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
