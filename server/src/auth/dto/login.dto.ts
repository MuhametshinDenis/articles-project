import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "User's email",
    required: true,
    type: [String],
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    required: true,
    type: [String],
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
