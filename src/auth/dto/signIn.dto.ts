import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'damquanson@gmail.com',
    description: 'Email of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', description: 'Password of the user' })
  password: string;
}
