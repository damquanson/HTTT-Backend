import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @ApiProperty()
  province: string;

  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsNotEmpty()
  @ApiProperty()
  district: string;

  @IsNotEmpty()
  @ApiProperty()
  streetNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  note: string;
}
