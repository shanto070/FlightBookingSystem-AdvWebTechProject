"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const aircraft_module_1 = require("../aircraft/aircraft.module");
const booking_entity_1 = require("../bookings/booking.entity");
const mail_module_1 = require("../mail/mail.module");
const notifications_module_1 = require("../notifications/notifications.module");
const flight_entity_1 = require("./flight.entity");
const flights_controller_1 = require("./flights.controller");
const flights_service_1 = require("./flights.service");
let FlightsModule = class FlightsModule {
};
exports.FlightsModule = FlightsModule;
exports.FlightsModule = FlightsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([flight_entity_1.Flight, booking_entity_1.Booking]),
            aircraft_module_1.AircraftModule,
            mail_module_1.MailModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [flights_controller_1.FlightsController],
        providers: [flights_service_1.FlightsService],
        exports: [flights_service_1.FlightsService, typeorm_1.TypeOrmModule],
    })
], FlightsModule);
//# sourceMappingURL=flights.module.js.map