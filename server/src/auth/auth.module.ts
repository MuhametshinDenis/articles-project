import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtManagerModule } from '../jwt-manager/jwt-manager.module';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [UsersModule, JwtManagerModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, JwtManagerModule],
})
export class AuthModule {}
