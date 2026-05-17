import { BookingStatus } from '../common/enums/booking-status.enum';
import { Flight } from '../flights/flight.entity';
import { User } from '../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Passenger } from './passenger.entity';
import { Payment } from './payment.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Flight, (flight) => flight.bookings, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'flightId' })
  flight!: Flight;

  @OneToMany(() => Passenger, (passenger) => passenger.booking, { cascade: true, eager: true })
  passengers!: Passenger[];

  @OneToOne(() => Payment, (payment) => payment.booking, { cascade: true, eager: true, nullable: true })
  payment?: Payment;

  @Column({ type: 'int' })
  totalPassengers!: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status!: BookingStatus;

  @CreateDateColumn()
  bookingDate!: Date;
}
