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
exports.FlightsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aircraft_service_1 = require("../aircraft/aircraft.service");
const booking_entity_1 = require("../bookings/booking.entity");
const mail_service_1 = require("../mail/mail.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const flight_entity_1 = require("./flight.entity");
let FlightsService = class FlightsService {
    constructor(flightRepo, bookingRepo, aircraftService, mailService, notificationsGateway) {
        this.flightRepo = flightRepo;
        this.bookingRepo = bookingRepo;
        this.aircraftService = aircraftService;
        this.mailService = mailService;
        this.notificationsGateway = notificationsGateway;
    }
    async create(dto) {
        const existing = await this.flightRepo.findOne({ where: { flightNumber: dto.flightNumber } });
        if (existing)
            throw new common_1.ConflictException('Flight number already exists');
        const aircraft = await this.aircraftService.findOne(dto.aircraftId);
        const flight = this.flightRepo.create({
            ...dto,
            departureTime: new Date(dto.departureTime),
            arrivalTime: new Date(dto.arrivalTime),
            aircraft,
        });
        return this.flightRepo.save(flight);
    }
    async search(query) {
        const qb = this.flightRepo.createQueryBuilder('flight').leftJoinAndSelect('flight.aircraft', 'aircraft');
        if (query.origin)
            qb.andWhere('LOWER(flight.origin) LIKE LOWER(:origin)', { origin: `%${query.origin}%` });
        if (query.destination)
            qb.andWhere('LOWER(flight.destination) LIKE LOWER(:destination)', { destination: `%${query.destination}%` });
        if (query.date) {
            qb.andWhere('DATE(flight.departureTime) = :date', { date: query.date });
        }
        return qb.orderBy('flight.departureTime', 'ASC').getMany();
    }
    async getCrew(flightId) {
        const flight = await this.flightRepo.findOne({
            where: { id: flightId },
            relations: ['assignedEmployees', 'assignedEmployees.user'],
        });
        if (!flight)
            throw new common_1.NotFoundException('Flight not found');
        return flight.assignedEmployees || [];
    }
    findAll() {
        return this.flightRepo.find();
    }
    async findOne(id) {
        const flight = await this.flightRepo.findOne({ where: { id }, relations: ['aircraft'] });
        if (!flight)
            throw new common_1.NotFoundException('Flight not found');
        return flight;
    }
    async update(id, dto) {
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
    async remove(id) {
        const flight = await this.findOne(id);
        const bookings = await this.bookingRepo.count({ where: { flight: { id } } });
        if (bookings > 0) {
            throw new common_1.BadRequestException('Cannot delete flight with existing bookings');
        }
        await this.flightRepo.remove(flight);
        return { message: 'Flight deleted successfully' };
    }
};
exports.FlightsService = FlightsService;
exports.FlightsService = FlightsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        aircraft_service_1.AircraftService,
        mail_service_1.MailService,
        notifications_gateway_1.NotificationsGateway])
], FlightsService);
//# sourceMappingURL=flights.service.js.map