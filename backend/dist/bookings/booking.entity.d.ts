import { BookingStatus } from '../common/enums/booking-status.enum';
import { Flight } from '../flights/flight.entity';
import { User } from '../users/users.entity';
import { Passenger } from './passenger.entity';
import { Payment } from './payment.entity';
export declare class Booking {
    id: number;
    user: User;
    flight: Flight;
    passengers: Passenger[];
    payment?: Payment;
    totalPassengers: number;
    status: BookingStatus;
    bookingDate: Date;
}
