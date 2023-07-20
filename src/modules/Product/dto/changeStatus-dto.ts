import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'aws-sdk/clients/outposts';

export class ChangeStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  status: OrderStatus;
}
