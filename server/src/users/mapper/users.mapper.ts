import { User } from 'generated/prisma';
import { UserResponseDto } from '../dto/user-response.dto';

export const toResponse = (user: User): UserResponseDto => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
