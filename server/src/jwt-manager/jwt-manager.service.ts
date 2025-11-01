import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './types/token-payload.type';
import express from 'express';
import { JwtToken } from './types/jwt-token.type';

@Injectable()
export class JwtManagerService {
  constructor(
    @Inject('JWT_ACCESS_SERVICE')
    private readonly jwtAccessService: JwtService,

    @Inject('JWT_REFRESH_SERVICE')
    private readonly jwtRefreshService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  public setAuthTokens(response: express.Response, payload: TokenPayload) {
    response.cookie('ACCESS_TOKEN', this.jwtAccessService.sign(payload), {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
    response.cookie('REFRESH_TOKEN', this.jwtRefreshService.sign(payload), {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }

  public clearAuthTokens(response: express.Response) {
    response.cookie('ACCESS_TOKEN', '', {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });

    response.cookie('REFRESH_TOKEN', '', {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }

  public setAccessToken(response: express.Response, payload: TokenPayload) {
    response.cookie('ACCESS_TOKEN', this.jwtAccessService.sign(payload), {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }

  public setRefreshToken(response: express.Response, payload: TokenPayload) {
    response.cookie('REFRESH_TOKEN', this.jwtRefreshService.sign(payload), {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    });
  }

  public validateAccessToken(accessToken: string): JwtToken {
    try {
      return this.jwtAccessService.verify(accessToken);
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }
  }

  public validateRefreshToken(refreshToken: string): JwtToken {
    try {
      return this.jwtRefreshService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }
  }

  public getRefreshTokenFromRequest(request: express.Request): string {
    const cookies: Record<string, string> = request.cookies;

    if (!cookies) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const refreshToken = cookies?.['REFRESH_TOKEN'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return refreshToken;
  }
}
