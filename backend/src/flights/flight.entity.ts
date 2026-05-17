import { Aircraft } from '../aircraft/aircraft.entity';
import { Booking } from '../bookings/booking.entity';
import { Employee } from '../employees/employee.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('flights')
export class Flight {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  flightNumber!: string;

  @Column()
  origin!: string;

  @Column()
  destination!: string;

  @Column({ type: 'timestamptz' })
  departureTime!: Date;

  @Column({ type: 'timestamptz' })
  arrivalTime!: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price!: number;

  @ManyToOne(() => Aircraft, (aircraft) => aircraft.flights, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'aircraftId' })
  aircraft!: Aircraft;

  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings!: Booking[];

  @ManyToMany(() => Employee, (employee) => employee.assignedFlights)
  assignedEmployees!: Employee[];
}
