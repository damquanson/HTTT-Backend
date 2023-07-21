import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsIn,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'libs/database/entities/order.entity';

export class ChangeStatusDto {
  @ApiProperty()
  orderId: number;

  @ApiProperty()
  @IsString()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
