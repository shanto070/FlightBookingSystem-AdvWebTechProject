import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { Flight } from '../flights/flight.entity';
import { User } from '../users/users.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Flight) private readonly flightRepo: Repository<Flight>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.EMPLOYEE) {
      throw new BadRequestException('Only users with employee role can have employee profile');
    }
    const exists = await this.employeeRepo.findOne({ where: { user: { id: user.id } } });
    if (exists) throw new BadRequestException('Employee profile already exists');

    const assignedFlights = dto.assignedFlightIds?.length
      ? await this.flightRepo.find({ where: { id: In(dto.assignedFlightIds) } })
      : [];
    if ((dto.assignedFlightIds?.length ?? 0) !== assignedFlights.length) {
      throw new NotFoundException('One or more assigned flights not found');
    }

    return this.employeeRepo.save(this.employeeRepo.create({ user, roleType: dto.roleType, assignedFlights }));
  }

  findAll(): Promise<Employee[]> {
    return this.employeeRepo.find({ relations: ['user', 'assignedFlights'] });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id }, relations: ['user', 'assignedFlights'] });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    if (dto.roleType) employee.roleType = dto.roleType;
    if (dto.assignedFlightIds) {
      const flights = await this.flightRepo.find({ where: { id: In(dto.assignedFlightIds) } });
      if (flights.length !== dto.assignedFlightIds.length) {
        throw new NotFoundException('One or more assigned flights not found');
      }
      employee.assignedFlights = flights;
    }
    return this.employeeRepo.save(employee);
  }

  async assignEmployeeToFlight(flightId: number, employeeId: number) {
    const employee = await this.findOne(employeeId);
    const flight = await this.flightRepo.findOne({ where: { id: flightId }, relations: ['assignedEmployees'] });
    if (!flight) throw new NotFoundException('Flight not found');

    const exists = (flight.assignedEmployees ?? []).some((e) => e.id === employee.id);
    if (!exists) {
      flight.assignedEmployees = [...(flight.assignedEmployees ?? []), employee];
      await this.flightRepo.save(flight);
    }
    return this.findOne(employeeId);
  }

  async removeEmployeeFromFlight(flightId: number, employeeId: number) {
    const flight = await this.flightRepo.findOne({ where: { id: flightId }, relations: ['assignedEmployees'] });
    if (!flight) throw new NotFoundException('Flight not found');
    flight.assignedEmployees = (flight.assignedEmployees ?? []).filter((e) => e.id !== employeeId);
    await this.flightRepo.save(flight);
    return { message: 'Removed from crew' };
  }
}
