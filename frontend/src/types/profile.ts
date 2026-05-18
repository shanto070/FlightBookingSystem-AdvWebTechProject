import { User } from './user';

export interface Profile {
  id: number;
  user: User;
  name?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
}
