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
exports.Aircraft = void 0;
const flight_entity_1 = require("../flights/flight.entity");
const typeorm_1 = require("typeorm");
let Aircraft = class Aircraft {
};
exports.Aircraft = Aircraft;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Aircraft.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Aircraft.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Aircraft.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Aircraft.prototype, "manufacturer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => flight_entity_1.Flight, (flight) => flight.aircraft),
    __metadata("design:type", Array)
], Aircraft.prototype, "flights", void 0);
exports.Aircraft = Aircraft = __decorate([
    (0, typeorm_1.Entity)('aircraft')
], Aircraft);
//# sourceMappingURL=aircraft.entity.js.map