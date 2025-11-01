import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request';
import { UserDetailsTypes } from '../types/user-details.types';

export const UserDetails = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserDetailsTypes => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const userDetails = request.user;

    if (!userDetails) {
      throw new UnauthorizedException('User is not authorized');
    }

    return userDetails;
  },
);
