import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import express from 'express';
import { JwtManagerService } from '../../jwt-manager/jwt-manager.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtManagerService: JwtManagerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken = this.extractAccessToken(request);

    request.user = this.jwtManagerService.validateAccessToken(accessToken);

    return true;
  }

  private extractAccessToken(request: express.Request) {
    const cookies: Record<string, string> = request.cookies;

    if (!cookies) {
      throw new UnauthorizedException('User is not authorized');
    }

    const token: string | undefined = cookies['ACCESS_TOKEN'];

    if (!token) {
      throw new UnauthorizedException('User is not authorized');
    }

    return token;
  }
}
