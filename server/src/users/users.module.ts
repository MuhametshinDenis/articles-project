import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { USERS_REPOSITORY } from './repository/users.repository';
import { UsersRepositoryImpl } from './repository/users.repository.impl';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepositoryImpl,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
