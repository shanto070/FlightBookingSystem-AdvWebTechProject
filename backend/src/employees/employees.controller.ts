import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { FlightsService } from '../flights/flights.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly flightsService: FlightsService,
  ) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(dto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  // Crew assignment helpers (admin): align with reference "assign crew" flow.
  @Post('/flights/:flightId/crew/:employeeId')
  assignCrew(
    @Param('flightId', ParseIntPipe) flightId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.employeesService.assignEmployeeToFlight(flightId, employeeId);
  }

  @Get('/flights/:flightId/crew')
  getCrew(@Param('flightId', ParseIntPipe) flightId: number) {
    return this.flightsService.getCrew(flightId);
  }

  @Patch('/flights/:flightId/crew/:employeeId/remove')
  removeCrew(
    @Param('flightId', ParseIntPipe) flightId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.employeesService.removeEmployeeFromFlight(flightId, employeeId);
  }
}
