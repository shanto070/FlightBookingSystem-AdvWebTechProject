import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Flight } from '../flights/flight.entity';
import { MailService } from '../mail/mail.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { User } from '../users/users.entity';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Passenger } from './passenger.entity';
import { Payment } from './payment.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Passenger) private readonly passengerRepo: Repository<Passenger>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Flight) private readonly flightRepo: Repository<Flight>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createBooking(user: User, dto: CreateBookingDto): Promise<Booking> {
    if (user.role !== UserRole.CUSTOMER) {
      throw new ForbiddenException('Only customers can create bookings');
    }
    if (!dto.passengers || dto.passengers.length === 0) {
      throw new BadRequestException('Passenger list cannot be empty');
    }

    const flight = await this.flightRepo.findOne({ where: { id: dto.flightId }, relations: ['aircraft'] });
    if (!flight) throw new NotFoundException('Flight not found');

    const totalBookedRaw = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('COALESCE(SUM(booking.totalPassengers), 0)', 'total')
      .where('booking.flightId = :flightId', { flightId: dto.flightId })
      .getRawOne<{ total: string }>();

    const existingPassengers = Number(totalBookedRaw?.total ?? 0);
    if (existingPassengers + dto.passengers.length > flight.aircraft.capacity) {
      throw new BadRequestException('Aircraft capacity exceeded');
    }

    const booking = await this.dataSource.transaction(async (manager) => {
      const createdBooking = manager.create(Booking, {
        user,
        flight,
        totalPassengers: dto.passengers.length,
      });
      const savedBooking = await manager.save(createdBooking);
      const passengers = dto.passengers.map((p) =>
        manager.create(Passenger, { ...p, booking: savedBooking }),
      );
      await manager.save(passengers);
      return manager.findOneOrFail(Booking, {
        where: { id: savedBooking.id },
        relations: ['user', 'flight', 'flight.aircraft', 'passengers'],
      });
    });

    await this.mailService.sendBookingConfirmationEmail(user.email, {
      customerName: user.fullName,
      bookingId: booking.id,
      bookingDate: booking.bookingDate,
      flightNumber: booking.flight.flightNumber,
      origin: booking.flight.origin,
      destination: booking.flight.destination,
      departureTime: booking.flight.departureTime,
      arrivalTime: booking.flight.arrivalTime,
      passengers: booking.passengers,
    });
    this.notificationsGateway.sendBookingCreated(user.id, booking);
    return booking;
  }

  getCustomerBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'flight', 'flight.aircraft', 'passengers'],
      order: { bookingDate: 'DESC' },
    });
  }

  getAllBookings(): Promise<Booking[]> {
    return this.bookingRepo.find({
      relations: ['user', 'flight', 'flight.aircraft', 'passengers'],
      order: { bookingDate: 'DESC' },
    });
  }

  async getBookingById(requester: { id: number; role: UserRole }, id: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'flight', 'flight.aircraft', 'passengers'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (requester.role === UserRole.CUSTOMER && booking.user.id !== requester.id) {
      throw new ForbiddenException('You can only view your own booking');
    }
    return booking;
  }

  async updateBookingStatus(id: number, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'flight', 'passengers'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    booking.status = dto.status;
    const updated = await this.bookingRepo.save(booking);

    await this.mailService.sendBookingStatusUpdateEmail(booking.user.email, {
      customerName: booking.user.fullName,
      bookingId: booking.id,
      status: booking.status,
      flightNumber: booking.flight.flightNumber,
    });
    this.notificationsGateway.sendBookingStatusUpdated(booking.user.id, {
      bookingId: booking.id,
      status: booking.status,
    });
    return updated;
  }

  async addPayment(requester: { id: number; role: UserRole }, bookingId: number, dto: CreatePaymentDto) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user', 'flight', 'payment'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    // Customer can only pay own booking; staff can pay any.
    if (requester.role === UserRole.CUSTOMER && booking.user.id !== requester.id) {
      throw new ForbiddenException('You can only pay for your own booking');
    }

    if (booking.payment) {
      // Replace existing payment with latest details.
      booking.payment.amount = dto.amount;
      booking.payment.method = dto.method;
      await this.paymentRepo.save(booking.payment);
    } else {
      booking.payment = await this.paymentRepo.save(this.paymentRepo.create({ booking, amount: dto.amount, method: dto.method }));
    }
    return this.bookingRepo.findOneOrFail({ where: { id: bookingId }, relations: ['user', 'flight', 'flight.aircraft', 'passengers', 'payment'] });
  }
}
