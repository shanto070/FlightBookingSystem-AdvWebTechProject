import { AircraftService } from './aircraft.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
export declare class AircraftController {
    private readonly aircraftService;
    constructor(aircraftService: AircraftService);
    create(dto: CreateAircraftDto): Promise<import("./aircraft.entity").Aircraft>;
    findAll(): Promise<import("./aircraft.entity").Aircraft[]>;
    findOne(id: number): Promise<import("./aircraft.entity").Aircraft>;
    update(id: number, dto: UpdateAircraftDto): Promise<import("./aircraft.entity").Aircraft>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
