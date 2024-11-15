import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { AuthModule, RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const rmqService = app.get<RmqService>(RmqService);
// connect microservice communications with rabbitMQ queue
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('NOTIFICATIONS')); // ack set to true because it's an hybrid service and response is needed over http
  // use class validator app level
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  // start microservices
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
