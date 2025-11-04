import { User } from 'generated/prisma';

export interface UsersRepository {
  create(
    data: Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>,
  ): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(data: User, id: number): Promise<User>;
  delete(id: number): Promise<void>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
