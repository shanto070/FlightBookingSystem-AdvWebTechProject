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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const flight_entity_1 = require("../flights/flight.entity");
const users_entity_1 = require("../users/users.entity");
const employee_entity_1 = require("./employee.entity");
let EmployeesService = class EmployeesService {
    constructor(employeeRepo, userRepo, flightRepo) {
        this.employeeRepo = employeeRepo;
        this.userRepo = userRepo;
        this.flightRepo = flightRepo;
    }
    async create(dto) {
        const user = await this.userRepo.findOne({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role !== user_role_enum_1.UserRole.EMPLOYEE) {
            throw new common_1.BadRequestException('Only users with employee role can have employee profile');
        }
        const exists = await this.employeeRepo.findOne({ where: { user: { id: user.id } } });
        if (exists)
            throw new common_1.BadRequestException('Employee profile already exists');
        const assignedFlights = dto.assignedFlightIds?.length
            ? await this.flightRepo.find({ where: { id: (0, typeorm_2.In)(dto.assignedFlightIds) } })
            : [];
        if ((dto.assignedFlightIds?.length ?? 0) !== assignedFlights.length) {
            throw new common_1.NotFoundException('One or more assigned flights not found');
        }
        return this.employeeRepo.save(this.employeeRepo.create({ user, roleType: dto.roleType, assignedFlights }));
    }
    findAll() {
        return this.employeeRepo.find({ relations: ['user', 'assignedFlights'] });
    }
    async findOne(id) {
        const employee = await this.employeeRepo.findOne({ where: { id }, relations: ['user', 'assignedFlights'] });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        return employee;
    }
    async update(id, dto) {
        const employee = await this.findOne(id);
        if (dto.roleType)
            employee.roleType = dto.roleType;
        if (dto.assignedFlightIds) {
            const flights = await this.flightRepo.find({ where: { id: (0, typeorm_2.In)(dto.assignedFlightIds) } });
            if (flights.length !== dto.assignedFlightIds.length) {
                throw new common_1.NotFoundException('One or more assigned flights not found');
            }
            employee.assignedFlights = flights;
        }
        return this.employeeRepo.save(employee);
    }
    async assignEmployeeToFlight(flightId, employeeId) {
        const employee = await this.findOne(employeeId);
        const flight = await this.flightRepo.findOne({ where: { id: flightId }, relations: ['assignedEmployees'] });
        if (!flight)
            throw new common_1.NotFoundException('Flight not found');
        const exists = (flight.assignedEmployees ?? []).some((e) => e.id === employee.id);
        if (!exists) {
            flight.assignedEmployees = [...(flight.assignedEmployees ?? []), employee];
            await this.flightRepo.save(flight);
        }
        return this.findOne(employeeId);
    }
    async removeEmployeeFromFlight(flightId, employeeId) {
        const flight = await this.flightRepo.findOne({ where: { id: flightId }, relations: ['assignedEmployees'] });
        if (!flight)
            throw new common_1.NotFoundException('Flight not found');
        flight.assignedEmployees = (flight.assignedEmployees ?? []).filter((e) => e.id !== employeeId);
        await this.flightRepo.save(flight);
        return { message: 'Removed from crew' };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(flight_entity_1.Flight)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map