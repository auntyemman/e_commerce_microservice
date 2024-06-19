import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { JwtAuthGuard } from '@app/common';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    console.log(req.user);
    return this.ordersService.createOrder(
      createOrderDto,
      req.cookies?.Authentication,
    );
  }

  @Get('get')
  async getOrders() {
    return await this.ordersService.getOrders();
  }
}
