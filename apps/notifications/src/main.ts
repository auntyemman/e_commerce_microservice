import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { AuthModule, RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker } from 'bullmq';

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

  const worker = new Worker(
    'NOTIFICATIONS_QUEUE',
    async (job) => {
    // This function can also be used if not using decorators
  }, {
    connection: { host: 'localhost', port: 6379 },
  });
  
  // Log worker events for debugging
  worker.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id} with error ${err.message}`);
  });
  await app.listen(configService.get('PORT'));
}
bootstrap();
