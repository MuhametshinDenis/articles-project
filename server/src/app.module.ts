import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { JwtManagerModule } from './jwt-manager/jwt-manager.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtManagerModule,
  ],
})
export class AppModule {}
