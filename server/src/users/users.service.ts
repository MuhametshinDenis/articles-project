import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  public async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    return user ? user : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? user : null;
  }

  public async deleteById(id: number): Promise<void> {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const userExists = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    return !!userExists;
  }
}
