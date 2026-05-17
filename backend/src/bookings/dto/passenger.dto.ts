import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class PassengerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  age!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passportNumber!: string;
}
