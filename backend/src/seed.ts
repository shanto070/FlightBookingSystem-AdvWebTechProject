import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Aircraft } from './aircraft/aircraft.entity';
import { Flight } from './flights/flight.entity';
import { UserRole } from './common/enums/user-role.enum';
import { User } from './users/users.entity';
import { Employee } from './employees/employee.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);
  const employeeRepo = dataSource.getRepository(Employee);
  const aircraftRepo = dataSource.getRepository(Aircraft);
  const flightRepo = dataSource.getRepository(Flight);

  const defaults = [
    { email: 'admin@flight.com', password: 'Admin@123', fullName: 'System Admin', role: UserRole.ADMIN },
    { email: 'employee@flight.com', password: 'Employee@123', fullName: 'Booking Employee', role: UserRole.EMPLOYEE },
    { email: 'customer@flight.com', password: 'Customer@123', fullName: 'Test Customer', role: UserRole.CUSTOMER },
  ];

  for (const u of defaults) {
    const exists = await userRepo.findOne({ where: { email: u.email } });
    if (!exists) {
      await userRepo.save(
        userRepo.create({
          ...u,
          password: await bcrypt.hash(u.password, 10),
        }),
      );
    }
  }

  // Ensure employee profile exists for default employee user.
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
    await flightRepo.save(
      flightRepo.create({
        flightNumber: 'BG101',
        origin: 'Dhaka',
        destination: 'Dubai',
        departureTime: departure,
        arrivalTime: arrival,
        price: 45000,
        aircraft,
      }),
    );
  }

  await app.close();
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
