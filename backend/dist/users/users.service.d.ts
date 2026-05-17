import { Repository } from "typeorm";
import { User } from './users.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    createUser(data: Partial<User>): Promise<User>;
    findByEmail(email: string, withPassword?: boolean): Promise<User | null>;
    findById(id: number): Promise<User>;
    findAll(): Promise<User[]>;
    updateUser(id: number, data: Partial<User>): Promise<User>;
}
