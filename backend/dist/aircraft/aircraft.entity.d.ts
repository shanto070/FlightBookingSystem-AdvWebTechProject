import { Flight } from '../flights/flight.entity';
export declare class Aircraft {
    id: number;
    model: string;
    capacity: number;
    manufacturer: string;
    flights: Flight[];
}
