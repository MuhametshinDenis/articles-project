import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import express from 'express';
import { JwtManagerService } from '../jwt-manager/jwt-manager.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,

    private readonly jwtManagerService: JwtManagerService,
  ) {}

  /**
   * Handles the user login process by verifying credentials, generating authentication tokens,
   * and sending a response with the user data.
   *
   * @param {LoginDto} loginDto - The login data transfer object containing user credentials (email and password).
   * @param {express.Response} response - The HTTP response object used to send the response to the client.
   * @return {Promise<void>} - A promise that resolves when the login process is complete and the response is sent.
   * @throws {UnauthorizedException} - If the user email is not found or the password comparison fails.
   */
  public async login(
    loginDto: LoginDto,
    response: express.Response,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      this.logger.warn(`Failed login attempt: email=${loginDto.email}`);
      throw new UnauthorizedException('Incorrect login or password');
    }

    const passwordCompare = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordCompare) {
      this.logger.warn(`Failed login: email=${loginDto.email}`);
      throw new UnauthorizedException('Incorrect login or password');
    }

    this.logger.log(`User logged in: id=${user.id}, email=${user.email}`);

    this.jwtManagerService.setAuthTokens(response, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    });

    response.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  /**
   * Handles user registration by creating a new user, logging the action, and setting authentication tokens.
   *
   * @param {RegisterDto} registerDto - The data transfer object containing registration details such as email, password, first name, and last name.
   * @param {express.Response} response - The HTTP response object used to send the response to the client.
   * @return {Promise<void>} A promise that resolves once the registration process is complete.
   * @throws {UnauthorizedException} Throws an error if the email is already associated with an existing user.
   */
  public async register(
    registerDto: RegisterDto,
    response: express.Response,
  ): Promise<void> {
    const userExists = await this.usersService.existsByEmail(registerDto.email);

    if (userExists) {
      this.logger.warn(`Failed register attempt: email=${registerDto.email}`);
      throw new UnauthorizedException('Use with this email already exists');
    }

    registerDto.password = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create(registerDto);

    this.logger.log(
      `User saved: email=${registerDto.email} firstName=${registerDto.firstName} lastName=${registerDto.lastName}`,
    );

    this.jwtManagerService.setAuthTokens(response, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    });

    response.json(user);
  }

  /**
   * Clears the access and refresh tokens from the response cookies.
   * @param response - The HTTP response object to clear the cookies.
   */
  public logout(response: express.Response) {
    this.jwtManagerService.clearAuthTokens(response);

    response.json({
      message: 'User logged out successfully',
    });
  }

  /**
   * Refreshes the access token by validating the provided refresh token from cookies and issuing a new access token.
   *
   * @param {express.Request} request - The HTTP request object which should contain the cookies with the refresh token.
   * @param {express.Response} response - The HTTP response object used to send the new access token and response message.
   * @return {void} Does not return any value.
   * @throws {UnauthorizedException} Throws an exception if the refresh token is missing or invalid.
   */
  public refresh(request: express.Request, response: express.Response): void {
    const refreshToken =
      this.jwtManagerService.getRefreshTokenFromRequest(request);

    const userDetails =
      this.jwtManagerService.validateRefreshToken(refreshToken);

    this.jwtManagerService.setAccessToken(response, {
      id: userDetails.id,
      email: userDetails.email,
      firstName: userDetails.firstName,
    });

    response.json({
      message: 'Successfully updating access token',
    });
  }

  public async getMe(request: express.Request) {
    const refreshToken =
      this.jwtManagerService.getRefreshTokenFromRequest(request);

    const userDetails =
      this.jwtManagerService.validateRefreshToken(refreshToken);

    const user = await this.usersService.findByEmail(userDetails.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
