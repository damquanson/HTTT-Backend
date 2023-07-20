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
  status: string;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  note: string;

  @ApiProperty({ type: [Number] })
  productIdArray: number[];
}
