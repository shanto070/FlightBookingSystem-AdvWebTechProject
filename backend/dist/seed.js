"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const bcrypt = require("bcryptjs");
const typeorm_1 = require("typeorm");
const app_module_1 = require("./app.module");
const aircraft_entity_1 = require("./aircraft/aircraft.entity");
const flight_entity_1 = require("./flights/flight.entity");
const user_role_enum_1 = require("./common/enums/user-role.enum");
const users_entity_1 = require("./users/users.entity");
const employee_entity_1 = require("./employees/employee.entity");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    const userRepo = dataSource.getRepository(users_entity_1.User);
    const employeeRepo = dataSource.getRepository(employee_entity_1.Employee);
    const aircraftRepo = dataSource.getRepository(aircraft_entity_1.Aircraft);
    const flightRepo = dataSource.getRepository(flight_entity_1.Flight);
    const defaults = [
        { email: 'admin@flight.com', password: 'Admin@123', fullName: 'System Admin', role: user_role_enum_1.UserRole.ADMIN },
        { email: 'employee@flight.com', password: 'Employee@123', fullName: 'Booking Employee', role: user_role_enum_1.UserRole.EMPLOYEE },
        { email: 'customer@flight.com', password: 'Customer@123', fullName: 'Test Customer', role: user_role_enum_1.UserRole.CUSTOMER },
    ];
    for (const u of defaults) {
        const exists = await userRepo.findOne({ where: { email: u.email } });
        if (!exists) {
            await userRepo.save(userRepo.create({
                ...u,
                password: await bcrypt.hash(u.password, 10),
            }));
        }
    }
    const employeeUser = await userRepo.findOne({ where: { email: 'employee@flight.com' } });
    if (employeeUser) {
        const existsEmployee = await employeeRepo.findOne({ where: { user: { id: employeeUser.id } } });
        if (!existsEmployee) {
            await employeeRepo.save(employeeRepo.create({ user: employeeUser, roleType: 'staff', assignedFlights: [] }));
        }
    }
    let aircraft = await aircraftRepo.findOne({ where: { model: 'Boeing 737', manufacturer: 'Boeing' } });
    if (!aircraft) {
        aircraft = await aircraftRepo.save(aircraftRepo.create({ model: 'Boeing 737', capacity: 180, manufacturer: 'Boeing' }));
    }
    const existingFlight = await flightRepo.findOne({ where: { flightNumber: 'BG101' } });
    if (!existingFlight) {
        const now = new Date();
        const departure = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const arrival = new Date(now.getTime() + 30 * 60 * 60 * 1000);
        await flightRepo.save(flightRepo.create({
            flightNumber: 'BG101',
            origin: 'Dhaka',
            destination: 'Dubai',
            departureTime: departure,
            arrivalTime: arrival,
            price: 45000,
            aircraft,
        }));
    }
    await app.close();
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map