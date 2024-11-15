import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '@app/common';
@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO, @Res() res: Response) {
    const user = await this.usersService.createUser(body);
    return res.status(201).json({
      status: 'success',
      message: 'user fetched succesfully',
      data: { user },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getUser(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.getUser({ _id: userId });
    return res.status(200).json({
      status: 'success',
      message: 'user fetched succesfully',
      data: { user },
    });
  }
}
