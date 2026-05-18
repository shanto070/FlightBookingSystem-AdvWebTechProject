import { FlightsService } from '../flights/flights.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private readonly employeesService;
    private readonly flightsService;
    constructor(employeesService: EmployeesService, flightsService: FlightsService);
    create(dto: CreateEmployeeDto): Promise<import("./employee.entity").Employee>;
    findAll(): Promise<import("./employee.entity").Employee[]>;
    findOne(id: number): Promise<import("./employee.entity").Employee>;
    update(id: number, dto: UpdateEmployeeDto): Promise<import("./employee.entity").Employee>;
    assignCrew(flightId: number, employeeId: number): Promise<import("./employee.entity").Employee>;
    getCrew(flightId: number): Promise<import("./employee.entity").Employee[] | null>;
    removeCrew(flightId: number, employeeId: number): Promise<{
        message: string;
    }>;
}
