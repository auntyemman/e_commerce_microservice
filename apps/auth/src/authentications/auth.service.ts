import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '../utils';

export interface TokenPayload {
  userId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(user: UserDocument) {
    const payload: TokenPayload = {
      userId: user._id as string,
      email: user.email,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
  }

  async generateRefreshToken(user: UserDocument) {
    const payload: TokenPayload = {
      userId: user._id as string,
      email: user.email,
    };
    return this.jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
  }

  // async verifyToken(token: string) {
  //   return await this.jwtService.verifyAsync(token);
  // }

  async verifyToken(
    token: string,
  ): Promise<{ valid: boolean; expired: boolean; decoded: any }> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return { valid: true, expired: false, decoded };
    } catch (error) {
      // Handle expired token and other verification errors gracefully
      if (error.name === 'TokenExpiredError') {
        return { valid: false, expired: true, decoded: null };
      }
      return { valid: false, expired: false, decoded: null };
    }
  }
}
