import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('bookings')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create booking (customer only)' })
  createBooking(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user as never, dto);
  }

  @Get('customer/booking')
  @Roles(UserRole.CUSTOMER)
  getCustomerBookings(@Req() req: any) {
    const user = req.user as { id: number };
    return this.bookingsService.getCustomerBookings(user.id);
  }

  @Get('employee/bookings')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @Patch('employee/bookings/:id/status')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  updateBookingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(id, dto);
  }

  @Get('bookings/:id')
  getBookingById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.getBookingById(req.user as never, id);
  }

  @Post('bookings/:id/payment')
  @Roles(UserRole.CUSTOMER, UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add/update payment for a booking' })
  addPayment(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: CreatePaymentDto) {
    return this.bookingsService.addPayment(req.user as never, id, dto);
  }
}
