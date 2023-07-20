import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  addressId: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  note: string;

  @ApiProperty({ default: 0 })
  total: number;

  @ApiProperty({ type: [Number] })
  productIdArray: number[];
}
