import { Repository } from "typeorm";
import { Aircraft } from './aircraft.entity';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
export declare class AircraftService {
    private readonly aircraftRepo;
    constructor(aircraftRepo: Repository<Aircraft>);
    create(dto: CreateAircraftDto): Promise<Aircraft>;
    findAll(): Promise<Aircraft[]>;
    findOne(id: number): Promise<Aircraft>;
    update(id: number, dto: UpdateAircraftDto): Promise<Aircraft>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
