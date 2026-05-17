import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 45000 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: 'card', description: 'cash|card|bkash|nagad etc' })
  @IsString()
  @IsIn(['cash', 'card', 'bkash', 'nagad', 'bank'])
  method!: string;
}
