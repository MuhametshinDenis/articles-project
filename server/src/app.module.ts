import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { JwtManagerModule } from './jwt-manager/jwt-manager.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    JwtManagerModule,
    ArticlesModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
})
export class AppModule {}
