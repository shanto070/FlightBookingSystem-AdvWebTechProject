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
exports.AircraftService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aircraft_entity_1 = require("./aircraft.entity");
let AircraftService = class AircraftService {
    constructor(aircraftRepo) {
        this.aircraftRepo = aircraftRepo;
    }
    create(dto) {
        return this.aircraftRepo.save(this.aircraftRepo.create(dto));
    }
    findAll() {
        return this.aircraftRepo.find();
    }
    async findOne(id) {
        const aircraft = await this.aircraftRepo.findOne({ where: { id } });
        if (!aircraft)
            throw new common_1.NotFoundException('Aircraft not found');
        return aircraft;
    }
    async update(id, dto) {
        const aircraft = await this.findOne(id);
        Object.assign(aircraft, dto);
        return this.aircraftRepo.save(aircraft);
    }
    async remove(id) {
        const aircraft = await this.findOne(id);
        await this.aircraftRepo.remove(aircraft);
        return { message: 'Aircraft deleted successfully' };
    }
};
exports.AircraftService = AircraftService;
exports.AircraftService = AircraftService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(aircraft_entity_1.Aircraft)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AircraftService);
//# sourceMappingURL=aircraft.service.js.map