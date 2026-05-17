import { Booking } from './booking.entity';
export declare class Payment {
    id: number;
    booking: Booking;
    amount: number;
    method: string;
}
