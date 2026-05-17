import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aircraft } from './aircraft.entity';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';

@Injectable()
export class AircraftService {
  constructor(
    @InjectRepository(Aircraft)
    private readonly aircraftRepo: Repository<Aircraft>,
  ) {}

  create(dto: CreateAircraftDto): Promise<Aircraft> {
    return this.aircraftRepo.save(this.aircraftRepo.create(dto));
  }

  findAll(): Promise<Aircraft[]> {
    return this.aircraftRepo.find();
  }

  async findOne(id: number): Promise<Aircraft> {
    const aircraft = await this.aircraftRepo.findOne({ where: { id } });
    if (!aircraft) throw new NotFoundException('Aircraft not found');
    return aircraft;
  }

  async update(id: number, dto: UpdateAircraftDto): Promise<Aircraft> {
    const aircraft = await this.findOne(id);
    Object.assign(aircraft, dto);
    return this.aircraftRepo.save(aircraft);
  }

  async remove(id: number): Promise<{ message: string }> {
    const aircraft = await this.findOne(id);
    await this.aircraftRepo.remove(aircraft);
    return { message: 'Aircraft deleted successfully' };
  }
}
