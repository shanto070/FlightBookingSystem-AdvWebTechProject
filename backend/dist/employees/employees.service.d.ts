import { Repository } from "typeorm";
import { Flight } from '../flights/flight.entity';
import { User } from '../users/users.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './employee.entity';
export declare class EmployeesService {
    private readonly employeeRepo;
    private readonly userRepo;
    private readonly flightRepo;
    constructor(employeeRepo: Repository<Employee>, userRepo: Repository<User>, flightRepo: Repository<Flight>);
    create(dto: CreateEmployeeDto): Promise<Employee>;
    findAll(): Promise<Employee[]>;
    findOne(id: number): Promise<Employee>;
    update(id: number, dto: UpdateEmployeeDto): Promise<Employee>;
    assignEmployeeToFlight(flightId: number, employeeId: number): Promise<Employee>;
    removeEmployeeFromFlight(flightId: number, employeeId: number): Promise<{
        message: string;
    }>;
}
