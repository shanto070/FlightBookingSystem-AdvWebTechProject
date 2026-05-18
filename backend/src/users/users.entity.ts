import { Booking } from '../bookings/booking.entity';
import { UserRole } from '../common/enums/user-role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  fullName!: string;

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];
}
