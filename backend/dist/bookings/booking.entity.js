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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const booking_status_enum_1 = require("../common/enums/booking-status.enum");
const flight_entity_1 = require("../flights/flight.entity");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const passenger_entity_1 = require("./passenger.entity");
const payment_entity_1 = require("./payment.entity");
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.bookings, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", users_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => flight_entity_1.Flight, (flight) => flight.bookings, { eager: true, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'flightId' }),
    __metadata("design:type", flight_entity_1.Flight)
], Booking.prototype, "flight", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => passenger_entity_1.Passenger, (passenger) => passenger.booking, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], Booking.prototype, "passengers", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => payment_entity_1.Payment, (payment) => payment.booking, { cascade: true, eager: true, nullable: true }),
    __metadata("design:type", payment_entity_1.Payment)
], Booking.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPassengers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: booking_status_enum_1.BookingStatus, default: booking_status_enum_1.BookingStatus.CONFIRMED }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Booking.prototype, "bookingDate", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)('bookings')
], Booking);
//# sourceMappingURL=booking.entity.js.map