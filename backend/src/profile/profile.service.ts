import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Profile } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private async getOrCreateByUserId(userId: number): Promise<Profile> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.profileRepo.findOne({ where: { user: { id: userId } } });
    if (existing) return existing;
    return this.profileRepo.save(this.profileRepo.create({ user, name: user.fullName }));
  }

  async getMe(userId: number) {
    return this.getOrCreateByUserId(userId);
  }

  async updateMe(userId: number, dto: UpdateProfileDto) {
    const profile = await this.getOrCreateByUserId(userId);
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }
}
