import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aircraft } from './aircraft.entity';
import { AircraftController } from './aircraft.controller';
import { AircraftService } from './aircraft.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aircraft])],
  controllers: [AircraftController],
  providers: [AircraftService],
  exports: [AircraftService, TypeOrmModule],
})
export class AircraftModule {}
