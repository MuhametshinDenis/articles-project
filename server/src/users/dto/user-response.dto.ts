import { User } from 'generated/prisma';

export type UserResponseDto = Promise<
  Omit<User, 'password' | 'createdAt' | 'updatedAt'>
>;
