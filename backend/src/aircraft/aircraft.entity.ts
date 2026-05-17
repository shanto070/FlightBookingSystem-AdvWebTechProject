import { Flight } from '../flights/flight.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('aircraft')
export class Aircraft {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  model!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column()
  manufacturer!: string;

  @OneToMany(() => Flight, (flight) => flight.aircraft)
  flights!: Flight[];
}
