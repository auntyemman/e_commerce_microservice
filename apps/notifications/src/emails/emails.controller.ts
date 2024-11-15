import { Controller, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { EmailsService } from './emails.service';
import { JwtAuthGuard, RmqService } from '@app/common';

@Controller('notifications')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly rmqService: RmqService,
  ) {}

  // @EventPattern('user_created')
  // @MessagePattern('user_created')
  async sendEmailValidation(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      await this.emailsService.emailVerification(data);
      return this.rmqService.ack(context);
    } catch (error) {
      console.error('Error processing user_created event:', error);
    }
  }
}
