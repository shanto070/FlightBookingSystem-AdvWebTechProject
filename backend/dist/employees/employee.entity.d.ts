import { Flight } from '../flights/flight.entity';
import { User } from '../users/users.entity';
export declare class Employee {
    id: number;
    user: User;
    roleType: string;
    assignedFlights: Flight[];
}
