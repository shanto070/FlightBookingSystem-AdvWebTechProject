import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: import("../common/enums/user-role.enum").UserRole;
        };
    }>;
    validateUser(email: string, password: string): Promise<User>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: import("../common/enums/user-role.enum").UserRole;
        };
    }>;
    private buildAuthResponse;
}
