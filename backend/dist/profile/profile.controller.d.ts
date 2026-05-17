import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getMe(req: any): Promise<import("./profile.entity").Profile>;
    updateMe(req: any, dto: UpdateProfileDto): Promise<import("./profile.entity").Profile>;
}
