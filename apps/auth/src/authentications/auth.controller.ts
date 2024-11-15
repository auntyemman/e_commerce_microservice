import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../utils/guards/local-auth.guard';
import { User, UserDocument } from '../users/schemas/user.schema';
import { REFRESH_TOKEN_EXPIRATION } from '../utils';

@Controller('auth')
export class AuthController {
  configService: any;
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    const access_token = await this.authService.generateAccessToken(user);
    const refresh_token = await this.authService.generateRefreshToken(user);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(201).json({
      status: 'success',
      message: 'login successful',
      data: { access_token, refresh_token },
    });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { valid, expired, decoded } =
      await this.authService.verifyToken(refreshToken);

    if (!valid || expired) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = decoded; // use the decoded token information to fetch user, if needed

    const newAccessToken = await this.authService.generateAccessToken(user);
    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    res.status(201).json({
      status: 'success',
      message: 'new access token generated succesfully',
      data: { accessToken: newAccessToken },
    });
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  // @EventPattern('validate_user')
  async validateUser(
    @CurrentUser() user: User /*tokens: { access_token: string }*/,
  ) {
    //   const accessToken = tokens.access_token;
    //   if (!accessToken) {
    //     throw new UnauthorizedException('Access token is missing');
    //   }

    //   const { valid, expired, decoded } =
    //     await this.authService.verifyToken(accessToken);

    //   if (!valid) {
    //     if (expired) {
    //       throw new UnauthorizedException('Access token expired');
    //     } else {
    //       throw new UnauthorizedException('Invalid access token');
    //     }
    //   }

    //   // Return the decoded user if valid
    //   return decoded;
    return user;
  }
}
