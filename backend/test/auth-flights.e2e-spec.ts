import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as bcrypt from 'bcryptjs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { loadEnvFile } from './load-env';
import { User } from '../src/users/users.entity';
import { UserRole } from '../src/common/enums/user-role.enum';
import { Aircraft } from '../src/aircraft/aircraft.entity';
import { Flight } from '../src/flights/flight.entity';

const e2eEnvPath = path.join(__dirname, '.env.e2e');
const hasE2EEnv = fs.existsSync(e2eEnvPath) || process.env.E2E_ALLOW_DEFAULT === '1';
const describeE2E = hasE2EEnv ? describe : describe.skip;

describeE2E('Auth + Flights (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    // Optional: create `test/.env.e2e` (not committed) to point tests at separate DB.
    if (fs.existsSync(e2eEnvPath)) loadEnvFile('test/.env.e2e');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    // Reset DB so tests deterministic.
    await dataSource.dropDatabase();
    await dataSource.synchronize();

    // Seed minimal data.
    const userRepo = dataSource.getRepository(User);
    const aircraftRepo = dataSource.getRepository(Aircraft);
    const flightRepo = dataSource.getRepository(Flight);

    await userRepo.save(
      userRepo.create({
        email: 'admin@flight.com',
        password: await bcrypt.hash('Admin@123', 10),
        fullName: 'System Admin',
        role: UserRole.ADMIN,
      }),
    );

    const aircraft = await aircraftRepo.save(
      aircraftRepo.create({ model: 'Boeing 737', manufacturer: 'Boeing', capacity: 180 }),
    );

    await flightRepo.save(
      flightRepo.create({
        flightNumber: 'BG101',
        origin: 'Dhaka',
        destination: 'Dubai',
        departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 30 * 60 * 60 * 1000),
        price: 45000,
        aircraft,
      }),
    );
  });

  afterAll(async () => {
    await app?.close();
  });

  it('login with default admin credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@flight.com', password: 'Admin@123' })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toMatchObject({ email: 'admin@flight.com', role: 'admin' });
  });

  it('register then login new customer', async () => {
    const reg = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Test Customer',
        email: 'new@flight.com',
        password: 'Customer@123',
        role: 'customer',
      })
      .expect(201);

    expect(reg.body).toHaveProperty('accessToken');
    expect(reg.body.user).toMatchObject({ email: 'new@flight.com', role: 'customer' });

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'new@flight.com', password: 'Customer@123' })
      .expect(201);

    expect(login.body).toHaveProperty('accessToken');
  });

  it('list flights (public)', async () => {
    const res = await request(app.getHttpServer()).get('/flights').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('flightNumber');
  });

  it('get flight details (public)', async () => {
    const list = await request(app.getHttpServer()).get('/flights').expect(200);
    const id = list.body[0].id;
    const res = await request(app.getHttpServer()).get(`/flights/${id}`).expect(200);
    expect(res.body).toHaveProperty('aircraft');
  });
});
