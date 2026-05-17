"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAircraftDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_aircraft_dto_1 = require("./create-aircraft.dto");
class UpdateAircraftDto extends (0, swagger_1.PartialType)(create_aircraft_dto_1.CreateAircraftDto) {
}
exports.UpdateAircraftDto = UpdateAircraftDto;
//# sourceMappingURL=update-aircraft.dto.js.map