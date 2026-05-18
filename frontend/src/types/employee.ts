import { Flight } from './flight';
import { User } from './user';

export interface Employee {
  id: number;
  user: User;
  roleType: string;
  assignedFlights?: Flight[];
}
