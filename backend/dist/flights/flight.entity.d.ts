import { Aircraft } from '../aircraft/aircraft.entity';
import { Booking } from '../bookings/booking.entity';
import { Employee } from '../employees/employee.entity';
export declare class Flight {
    id: number;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    price: number;
    aircraft: Aircraft;
    bookings: Booking[];
    assignedEmployees: Employee[];
}
