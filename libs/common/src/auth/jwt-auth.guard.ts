import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../utils/constants';
import { Observable, catchError, tap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    const refreshToken = this.extractRefreshToken(context);

    return this.authClient
      .send('validate_user', {
        accessToken: authentication,
        refreshToken: refreshToken,
      })
      .pipe(
        tap((res) => {
          this.addUser(res, context);
        }),
        catchError((error) => {
          if (error.message === 'Invalid token') {
            throw new UnauthorizedException('Invalid token');
          }
          if (error.message === 'Missing refresh token') {
            throw new UnauthorizedException('Missing refresh token');
          }
          if (error.message === 'Invalid refresh token') {
            throw new UnauthorizedException('Invalid refresh token');
          }
          throw new UnauthorizedException('token expired');
        }),
      );
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      authentication = context
        .switchToHttp()
        .getRequest()
        .rawHeaders[1].split(' ')[1];
    }
    if (!authentication) {
      throw new UnauthorizedException('Authentication token not found.');
    }

    return authentication;
  }

  private extractRefreshToken(context: ExecutionContext): string | undefined {
    let refreshToken: string;
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      refreshToken = request.cookies?.refresh_token;
    } else if (context.getType() === 'rpc') {
      const rpcData = context.switchToRpc().getData();
      refreshToken = rpcData?.refresh_token;
    } else if (context.getType() === 'ws') {
      const wsClient = context.switchToWs().getClient();
      refreshToken = wsClient?.handshake?.headers?.refresh_token;
    }
    if (!refreshToken) {
      return undefined;
      // throw new UnauthorizedException('You will need to login again.');
    }
    return refreshToken;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
