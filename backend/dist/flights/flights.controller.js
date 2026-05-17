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
exports.FlightsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_flight_dto_1 = require("./dto/create-flight.dto");
const search_flight_dto_1 = require("./dto/search-flight.dto");
const update_flight_dto_1 = require("./dto/update-flight.dto");
const flights_service_1 = require("./flights.service");
let FlightsController = class FlightsController {
    constructor(flightsService) {
        this.flightsService = flightsService;
    }
    findAll(query) {
        return this.flightsService.search(query);
    }
    findOne(id) {
        return this.flightsService.findOne(id);
    }
    create(dto) {
        return this.flightsService.create(dto);
    }
    update(id, dto) {
        return this.flightsService.update(id, dto);
    }
    remove(id) {
        return this.flightsService.remove(id);
    }
};
exports.FlightsController = FlightsController;
__decorate([
    (0, common_1.Get)('flights'),
    (0, swagger_1.ApiOperation)({ summary: 'Search and list flights (public)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_flight_dto_1.SearchFlightDto]),
    __metadata("design:returntype", void 0)
], FlightsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('flights/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FlightsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('admin/flights'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_flight_dto_1.CreateFlightDto]),
    __metadata("design:returntype", void 0)
], FlightsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('admin/flights/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_flight_dto_1.UpdateFlightDto]),
    __metadata("design:returntype", void 0)
], FlightsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('admin/flights/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FlightsController.prototype, "remove", null);
exports.FlightsController = FlightsController = __decorate([
    (0, swagger_1.ApiTags)('Flights'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [flights_service_1.FlightsService])
], FlightsController);
//# sourceMappingURL=flights.controller.js.map