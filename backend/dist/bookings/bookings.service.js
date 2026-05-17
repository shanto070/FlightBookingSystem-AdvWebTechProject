"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const flight_entity_1 = require("../flights/flight.entity");
const mail_service_1 = require("../mail/mail.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const booking_entity_1 = require("./booking.entity");
const passenger_entity_1 = require("./passenger.entity");
const payment_entity_1 = require("./payment.entity");
let BookingsService = class BookingsService {
    constructor(bookingRepo, passengerRepo, paymentRepo, flightRepo, dataSource, mailService, notificationsGateway) {
        this.bookingRepo = bookingRepo;
        this.passengerRepo = passengerRepo;
        this.paymentRepo = paymentRepo;
        this.flightRepo = flightRepo;
        this.dataSource = dataSource;
        this.mailService = mailService;
        this.notificationsGateway = notificationsGateway;
    }
    async createBooking(user, dto) {
        if (user.role !== user_role_enum_1.UserRole.CUSTOMER) {
            throw new common_1.ForbiddenException('Only customers can create bookings');
        }
        if (!dto.passengers || dto.passengers.length === 0) {
            throw new common_1.BadRequestException('Passenger list cannot be empty');
        }
        const flight = await this.flightRepo.findOne({ where: { id: dto.flightId }, relations: ['aircraft'] });
        if (!flight)
            throw new common_1.NotFoundException('Flight not found');
        const totalBookedRaw = await this.bookingRepo
            .createQueryBuilder('booking')
            .select('COALESCE(SUM(booking.totalPassengers), 0)', 'total')
            .where('booking.flightId = :flightId', { flightId: dto.flightId })
            .getRawOne();
        const existingPassengers = Number(totalBookedRaw?.total ?? 0);
        if (existingPassengers + dto.passengers.length > flight.aircraft.capacity) {
            throw new common_1.BadRequestException('Aircraft capacity exceeded');
        }
        const booking = await this.dataSource.transaction(async (manager) => {
            const createdBooking = manager.create(booking_entity_1.Booking, {
                user,
                flight,
                totalPassengers: dto.passengers.length,
            });
            const savedBooking = await manager.save(createdBooking);
            const passengers = dto.passengers.map((p) => manager.create(passenger_entity_1.Passenger, { ...p, booking: savedBooking }));
            await manager.save(passengers);
            return manager.findOneOrFail(booking_entity_1.Booking, {
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
    getCustomerBookings(userId) {
        return this.bookingRepo.find({
            where: { user: { id: userId } },
            relations: ['user', 'flight', 'flight.aircraft', 'passengers'],
            order: { bookingDate: 'DESC' },
        });
    }
    getAllBookings() {
        return this.bookingRepo.find({
            relations: ['user', 'flight', 'flight.aircraft', 'passengers'],
            order: { bookingDate: 'DESC' },
        });
    }
    async getBookingById(requester, id) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['user', 'flight', 'flight.aircraft', 'passengers'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (requester.role === user_role_enum_1.UserRole.CUSTOMER && booking.user.id !== requester.id) {
            throw new common_1.ForbiddenException('You can only view your own booking');
        }
        return booking;
    }
    async updateBookingStatus(id, dto) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['user', 'flight', 'passengers'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
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
    async addPayment(requester, bookingId, dto) {
        const booking = await this.bookingRepo.findOne({
            where: { id: bookingId },
            relations: ['user', 'flight', 'payment'],
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (requester.role === user_role_enum_1.UserRole.CUSTOMER && booking.user.id !== requester.id) {
            throw new common_1.ForbiddenException('You can only pay for your own booking');
        }
        if (booking.payment) {
            booking.payment.amount = dto.amount;
            booking.payment.method = dto.method;
            await this.paymentRepo.save(booking.payment);
        }
        else {
            booking.payment = await this.paymentRepo.save(this.paymentRepo.create({ booking, amount: dto.amount, method: dto.method }));
        }
        return this.bookingRepo.findOneOrFail({ where: { id: bookingId }, relations: ['user', 'flight', 'flight.aircraft', 'passengers', 'payment'] });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(passenger_entity_1.Passenger)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(3, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        mail_service_1.MailService,
        notifications_gateway_1.NotificationsGateway])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map