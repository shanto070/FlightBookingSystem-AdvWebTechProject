import { Flight } from './flight';
import { User } from './user';

export interface Passenger {
  id?: number;
  name: string;
  age: number;
  passportNumber: string;
}

export interface Payment {
  id: number;
  amount: number;
  method: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: number;
  user: User;
  flight: Flight;
  passengers: Passenger[];
  totalPassengers: number;
  status: BookingStatus;
  bookingDate: string;
  payment?: Payment;
}
