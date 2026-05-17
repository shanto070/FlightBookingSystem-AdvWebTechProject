import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId!: number;

  @ApiProperty()
  @IsString()
  roleType!: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  assignedFlightIds?: number[];
}
