import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateFlightDto {
  @ApiProperty()
  @IsString()
  flightNumber!: string;

  @ApiProperty()
  @IsString()
  origin!: string;

  @ApiProperty()
  @IsString()
  destination!: string;

  @ApiProperty()
  @IsDateString()
  departureTime!: string;

  @ApiProperty()
  @IsDateString()
  arrivalTime!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  aircraftId!: number;
}
