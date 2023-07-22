import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;
}
