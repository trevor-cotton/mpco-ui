import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

export enum ErrorType {
  MISPick = 'mispick',
  DAMAGED = 'damaged',
  MISSING = 'missing',
  OTHER = 'other',
}

@Entity('error_logs')
export class ErrorLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.errorLogs)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: true })
  packerId: string;

  @ManyToOne(() => User, (user) => user.errorLogs, { nullable: true })
  @JoinColumn({ name: 'packerId' })
  packer: User;

  @Column({
    type: 'enum',
    enum: ErrorType,
  })
  errorType: ErrorType;

  @Column('text')
  description: string;

  @Column({ default: false })
  resolved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

