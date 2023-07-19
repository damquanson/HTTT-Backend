import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsString } from 'class-validator';

export class AddressDTo {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Hanoi',
    description: 'address',

  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hai Ba Trung', description: 'This is district of user' })
  district: string;


  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Dai co viet', description: 'This is city of user' })
  street: string;


  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nha 64', description: 'This is house num of user' })
  housenum: string;


}
