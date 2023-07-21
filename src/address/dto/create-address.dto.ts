import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateAddressDto {

    // @PrimaryGeneratedColumn()
    // id: number;
  
    // @Column()
    // name: string;
  
    // @Column()
    // phone: string;
  
    // @Column()
    // province: string;
  
    // @Column()
    // country: string;
  
    // @Column()
    // district: string;
  
    // @Column()
    // streetNumber: string;
  
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  province: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
    district: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  phone: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  streetNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  note: string;
}
