import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { PassengerDto } from './passenger.dto';

export class CreateBookingDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  flightId!: number;

  @ApiProperty({ type: [PassengerDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers!: PassengerDto[];
}
