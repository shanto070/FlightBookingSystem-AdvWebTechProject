import { DataSource, Repository } from "typeorm";
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
export declare class BookingsService {
    private readonly bookingRepo;
    private readonly passengerRepo;
    private readonly paymentRepo;
    private readonly flightRepo;
    private readonly dataSource;
    private readonly mailService;
    private readonly notificationsGateway;
    constructor(bookingRepo: Repository<Booking>, passengerRepo: Repository<Passenger>, paymentRepo: Repository<Payment>, flightRepo: Repository<Flight>, dataSource: DataSource, mailService: MailService, notificationsGateway: NotificationsGateway);
    createBooking(user: User, dto: CreateBookingDto): Promise<Booking>;
    getCustomerBookings(userId: number): Promise<Booking[]>;
    getAllBookings(): Promise<Booking[]>;
    getBookingById(requester: {
        id: number;
        role: UserRole;
    }, id: number): Promise<Booking>;
    updateBookingStatus(id: number, dto: UpdateBookingStatusDto): Promise<Booking>;
    addPayment(requester: {
        id: number;
        role: UserRole;
    }, bookingId: number, dto: CreatePaymentDto): Promise<Booking>;
}
