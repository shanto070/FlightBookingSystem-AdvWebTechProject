import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(req: any, dto: CreateBookingDto): Promise<import("./booking.entity").Booking>;
    getCustomerBookings(req: any): Promise<import("./booking.entity").Booking[]>;
    getAllBookings(): Promise<import("./booking.entity").Booking[]>;
    updateBookingStatus(id: number, dto: UpdateBookingStatusDto): Promise<import("./booking.entity").Booking>;
    getBookingById(req: any, id: number): Promise<import("./booking.entity").Booking>;
    addPayment(req: any, id: number, dto: CreatePaymentDto): Promise<import("./booking.entity").Booking>;
}
