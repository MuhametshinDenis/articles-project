import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from 'generated/prisma';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  public async create(
    data: Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>,
  ): Promise<User> {
    return this.prisma.user.create({ data });
  }

  public async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async update(data: User, id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
