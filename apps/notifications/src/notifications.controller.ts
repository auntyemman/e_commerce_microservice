import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common/rmq/rmq.service';
import { EmailsService } from './emails/emails.service';

@Controller()
export class NotificationsController {
  protected readonly logger = new Logger('NOTIFICATIONS');
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly rmqService: RmqService,
    private readonly emailsService: EmailsService,
  ) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      await this.emailsService.emailVerification(data);
      return this.rmqService.ack(context);
    } catch (error) {
      this.logger.error('Error processing user_created event:', error);
    }
  }
}
