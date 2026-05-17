import { CreateFlightDto } from './dto/create-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightsService } from './flights.service';
export declare class FlightsController {
    private readonly flightsService;
    constructor(flightsService: FlightsService);
    findAll(query: SearchFlightDto): Promise<import("./flight.entity").Flight[]>;
    findOne(id: number): Promise<import("./flight.entity").Flight>;
    create(dto: CreateFlightDto): Promise<import("./flight.entity").Flight>;
    update(id: number, dto: UpdateFlightDto): Promise<import("./flight.entity").Flight>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
