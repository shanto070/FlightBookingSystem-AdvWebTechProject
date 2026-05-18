import { Repository } from "typeorm";
import { AircraftService } from '../aircraft/aircraft.service';
import { Booking } from '../bookings/booking.entity';
import { Employee } from '../employees/employee.entity';
import { MailService } from '../mail/mail.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Flight } from './flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
export declare class FlightsService {
    private readonly flightRepo;
    private readonly bookingRepo;
    private readonly aircraftService;
    private readonly mailService;
    private readonly notificationsGateway;
    constructor(flightRepo: Repository<Flight>, bookingRepo: Repository<Booking>, aircraftService: AircraftService, mailService: MailService, notificationsGateway: NotificationsGateway);
    create(dto: CreateFlightDto): Promise<Flight>;
    search(query: SearchFlightDto): Promise<Flight[]>;
    getCrew(flightId: number): Promise<Employee[] | null>;
    findAll(): Promise<Flight[]>;
    findOne(id: number): Promise<Flight>;
    update(id: number, dto: UpdateFlightDto): Promise<Flight>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
