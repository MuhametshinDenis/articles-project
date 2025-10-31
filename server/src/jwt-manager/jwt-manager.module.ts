import { Module } from '@nestjs/common';
import { JwtManagerService } from './jwt-manager.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';

@Module({
  providers: [
    JwtManagerService,
    {
      provide: 'JWT_ACCESS_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.getOrThrow<string>('jwt.access.secret'),
          signOptions: {
            expiresIn: configService.getOrThrow<StringValue>(
              'jwt.access.expiresIn',
            ),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'JWT_REFRESH_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.getOrThrow<string>('jwt.refresh.secret'),
          signOptions: {
            expiresIn: configService.getOrThrow<StringValue>(
              'jwt.refresh.expiresIn',
            ),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [JwtManagerService],
})
export class JwtManagerModule {}
