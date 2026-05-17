import { User } from '../users/users.entity';
export declare class Profile {
    id: number;
    user: User;
    name?: string;
    phone?: string;
    address?: string;
    loyaltyPoints: number;
}
