import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RmqModule, DatabaseModule, AuthModule } from '@app/common';
import * as Joi from 'joi';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ACCESS_TOKEN_EXPIRATION, NOTIFICATIONS_SERVICE } from './utils';
import { EmailsModule } from './emails/emails.module';
import { BullMQModule } from '@app/common';
// import { NotificationProcessor } from './notifications.processor';

@Module({
  imports: [
    EmailsModule,
    DatabaseModule,
    RmqModule.register({
      name: NOTIFICATIONS_SERVICE,
    }),
    // BullMQModule.register('NOTIFICATIONS_QUEUE'),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_NOTIFICATIONS_QUEUE: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/notifications/.env',
    }),
    RmqModule,
    AuthModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: ACCESS_TOKEN_EXPIRATION,
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
