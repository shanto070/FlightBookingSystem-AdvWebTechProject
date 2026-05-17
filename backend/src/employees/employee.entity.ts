import { Flight } from '../flights/flight.entity';
import { User } from '../users/users.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @Column()
  roleType!: string;

  @ManyToMany(() => Flight, (flight) => flight.assignedEmployees)
  @JoinTable({ name: 'employee_flights' })
  assignedFlights!: Flight[];
}
