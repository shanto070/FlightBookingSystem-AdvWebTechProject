import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AircraftService } from '../aircraft/aircraft.service';
import { Booking } from '../bookings/booking.entity';
import { MailService } from '../mail/mail.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Flight } from './flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly aircraftService: AircraftService,
    private readonly mailService: MailService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateFlightDto): Promise<Flight> {
    const existing = await this.flightRepo.findOne({ where: { flightNumber: dto.flightNumber } });
    if (existing) throw new ConflictException('Flight number already exists');
    const aircraft = await this.aircraftService.findOne(dto.aircraftId);
    const flight = this.flightRepo.create({
      ...dto,
      departureTime: new Date(dto.departureTime),
      arrivalTime: new Date(dto.arrivalTime),
      aircraft,
    });
    return this.flightRepo.save(flight);
  }

  async search(query: SearchFlightDto): Promise<Flight[]> {
    const qb = this.flightRepo.createQueryBuilder('flight').leftJoinAndSelect('flight.aircraft', 'aircraft');
    if (query.origin) qb.andWhere('LOWER(flight.origin) LIKE LOWER(:origin)', { origin: `%${query.origin}%` });
    if (query.destination) qb.andWhere('LOWER(flight.destination) LIKE LOWER(:destination)', { destination: `%${query.destination}%` });
    if (query.date) {
      qb.andWhere('DATE(flight.departureTime) = :date', { date: query.date });
    }
    return qb.orderBy('flight.departureTime', 'ASC').getMany();
  }

  findAll(): Promise<Flight[]> {
    return this.flightRepo.find();
  }

  async findOne(id: number): Promise<Flight> {
    const flight = await this.flightRepo.findOne({ where: { id }, relations: ['aircraft'] });
    if (!flight) throw new NotFoundException('Flight not found');
    return flight;
  }

  async getCrew(flightId: number) {
    const flight = await this.flightRepo.findOne({ where: { id: flightId }, relations: ['assignedEmployees', 'assignedEmployees.user'] });
    if (!flight) throw new NotFoundException('Flight not found');
    return flight.assignedEmployees ?? [];
  }

  async update(id: number, dto: UpdateFlightDto): Promise<Flight> {
    const flight = await this.findOne(id);
    const oldTimes = { departureTime: flight.departureTime, arrivalTime: flight.arrivalTime };

    if (dto.aircraftId) {
      flight.aircraft = await this.aircraftService.findOne(dto.aircraftId);
    }
    Object.assign(flight, {
      ...dto,
      departureTime: dto.departureTime ? new Date(dto.departureTime) : flight.departureTime,
      arrivalTime: dto.arrivalTime ? new Date(dto.arrivalTime) : flight.arrivalTime,
    });

    const updated = await this.flightRepo.save(flight);
    const scheduleChanged = !!(dto.departureTime || dto.arrivalTime);
    if (scheduleChanged) {
      const bookings = await this.bookingRepo.find({ where: { flight: { id: updated.id } }, relations: ['user'] });
      for (const booking of bookings) {
        await this.mailService.sendFlightScheduleUpdateEmail(booking.user.email, {
          customerName: booking.user.fullName,
          flightNumber: updated.flightNumber,
          origin: updated.origin,
          destination: updated.destination,
          oldDepartureTime: oldTimes.departureTime,
          oldArrivalTime: oldTimes.arrivalTime,
          newDepartureTime: updated.departureTime,
          newArrivalTime: updated.arrivalTime,
        });
        this.notificationsGateway.sendFlightScheduleChanged(booking.user.id, {
          bookingId: booking.id,
          flightId: updated.id,
          flightNumber: updated.flightNumber,
          newDepartureTime: updated.departureTime,
          newArrivalTime: updated.arrivalTime,
        });
      }
    }
    return updated;
  }

  async remove(id: number): Promise<{ message: string }> {
    const flight = await this.findOne(id);
    const bookings = await this.bookingRepo.count({ where: { flight: { id } } });
    if (bookings > 0) {
      throw new BadRequestException('Cannot delete flight with existing bookings');
    }
    await this.flightRepo.remove(flight);
    return { message: 'Flight deleted successfully' };
  }
}
