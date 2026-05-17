import { Repository } from "typeorm";
import { User } from '../users/users.entity';
import { Profile } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileService {
    private readonly profileRepo;
    private readonly userRepo;
    constructor(profileRepo: Repository<Profile>, userRepo: Repository<User>);
    private getOrCreateByUserId;
    getMe(userId: number): Promise<Profile>;
    updateMe(userId: number, dto: UpdateProfileDto): Promise<Profile>;
}
