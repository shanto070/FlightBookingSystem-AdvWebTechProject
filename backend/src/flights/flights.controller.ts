import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateFlightDto } from './dto/create-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightsService } from './flights.service';

@ApiTags('Flights')
@Controller()
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('flights')
  @ApiOperation({ summary: 'Search and list flights (public)' })
  findAll(@Query() query: SearchFlightDto) {
    return this.flightsService.search(query);
  }

  @Get('flights/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.findOne(id);
  }

  @Post('admin/flights')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateFlightDto) {
    return this.flightsService.create(dto);
  }

  @Put('admin/flights/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFlightDto) {
    return this.flightsService.update(id, dto);
  }

  @Delete('admin/flights/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.flightsService.remove(id);
  }
}
