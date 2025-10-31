import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import { RegisterDto } from './dto/register.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(
    @Res({ passthrough: true }) response: express.Response,
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto, response);
  }

  @Post('/register')
  public async register(
    @Res() response: express.Response,
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto, response);
  }

  @Post('/logout')
  public logout(@Res() response: express.Response) {
    return this.authService.logout(response);
  }

  @Post('refresh')
  public refresh(
    @Req() request: express.Request,
    @Res() response: express.Response,
  ) {
    return this.authService.refresh(request, response);
  }

  @Get('me')
  public getMe(@Req() request: express.Request) {
    return this.authService.getMe(request);
  }
}
