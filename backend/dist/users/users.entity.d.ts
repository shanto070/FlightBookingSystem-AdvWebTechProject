import { Booking } from '../bookings/booking.entity';
import { UserRole } from '../common/enums/user-role.enum';
export declare class User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
    bookings: Booking[];
}
