// import { AuthGuard } from '@nestjs/passport';

// export class JwtAuthGuard extends AuthGuard('jwt') {}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from '../../authentications/auth.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    // const accessToken = this.extractTokenFromHeader(request);
    const accessToken = request.accessToken;

    const { valid, expired, decoded } =
      await this.authService.verifyToken(accessToken);

    if (expired) {
      const refreshToken = request.refreshToken;
      if (!refreshToken) {
        throw new RpcException('Missing refresh token');
      }
      const { valid: refreshValid, decoded: refreshDecoded } =
        await this.authService.verifyToken(refreshToken);
      if (!refreshValid) {
        throw new RpcException('Invalid refresh token');
      }

      const newAccessToken =
        await this.authService.generateAccessToken(refreshDecoded);
      // response.setHeader('Authorization', `Bearer ${newAccessToken}`);
      request.user = refreshDecoded;
      return true;
    } else if (valid === false) {
      throw new RpcException('Invalid token');
    }

    request.user = decoded; // Attach user to request
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   console.log(request);
  //   const token = request.Authentication;
  //   // const token = this.extractTokenFromHeader(request);
  //   if (!token) {
  //     throw new UnauthorizedException();
  //   }
  //   try {
  //     const payload = await this.jwtService.verifyAsync(token);
  //     // 💡 We're assigning the payload to the request object here
  //     // so that we can access it in our route handlers
  //     request['user'] = payload;
  //   } catch {
  //     throw new UnauthorizedException();
  //   }
  //   return true;
  // }

  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }
}
