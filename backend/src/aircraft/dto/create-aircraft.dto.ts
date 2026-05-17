import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateAircraftDto {
  @ApiProperty()
  @IsString()
  model!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  capacity!: number;

  @ApiProperty()
  @IsString()
  manufacturer!: string;
}
