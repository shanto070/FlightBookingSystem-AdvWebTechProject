import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AircraftModule } from '../aircraft/aircraft.module';
import { Booking } from '../bookings/booking.entity';
import { MailModule } from '../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Flight } from './flight.entity';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Flight, Booking]),
    AircraftModule,
    MailModule,
    NotificationsModule,
  ],
  controllers: [FlightsController],
  providers: [FlightsService],
  exports: [FlightsService, TypeOrmModule],
})
export class FlightsModule {}
