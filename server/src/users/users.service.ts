import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from 'generated/prisma';
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from './repository/users.repository';
import { toResponse } from './mapper/users.mapper';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const savedUser = await this.usersRepository.create(createUserDto);
    return toResponse(savedUser);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    return user ? user : null;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const userExists = await this.usersRepository.findByEmail(email);
    return !!userExists;
  }
}
