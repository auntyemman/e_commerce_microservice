import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATIONS_SERVICE } from './utils';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {}
  // onModuleInit() {
  //   this.notificationClient
  //     .connect()
  //     .then(() => {
  //       console.log('Successfully connected to RabbitMQ');
  //     })
  //     .catch((error) => {
  //       console.error('Error connecting to RabbitMQ:', error);
  //   });
  // }
  handleUserCreated(): string {
    return 'Hello World!';
  }
}
