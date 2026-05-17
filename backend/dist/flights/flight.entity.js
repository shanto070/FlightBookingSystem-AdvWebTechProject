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
exports.Flight = void 0;
const aircraft_entity_1 = require("../aircraft/aircraft.entity");
const booking_entity_1 = require("../bookings/booking.entity");
const employee_entity_1 = require("../employees/employee.entity");
const typeorm_1 = require("typeorm");
let Flight = class Flight {
};
exports.Flight = Flight;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Flight.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Flight.prototype, "flightNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Flight.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Flight.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Flight.prototype, "departureTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Flight.prototype, "arrivalTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Flight.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => aircraft_entity_1.Aircraft, (aircraft) => aircraft.flights, { eager: true, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'aircraftId' }),
    __metadata("design:type", aircraft_entity_1.Aircraft)
], Flight.prototype, "aircraft", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.flight),
    __metadata("design:type", Array)
], Flight.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => employee_entity_1.Employee, (employee) => employee.assignedFlights),
    __metadata("design:type", Array)
], Flight.prototype, "assignedEmployees", void 0);
exports.Flight = Flight = __decorate([
    (0, typeorm_1.Entity)('flights')
], Flight);
//# sourceMappingURL=flight.entity.js.map