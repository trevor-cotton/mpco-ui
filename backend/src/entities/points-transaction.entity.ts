import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

export enum PointsTransactionType {
  AWARD = 'award',
  PENALTY = 'penalty',
}

@Entity('points_transactions')
export class PointsTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  packerId: string;

  @ManyToOne(() => User, (user) => user.pointsTransactions)
  @JoinColumn({ name: 'packerId' })
  packer: User;

  @Column({ nullable: true })
  orderId: string;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('int')
  points: number;

  @Column({
    type: 'enum',
    enum: PointsTransactionType,
  })
  type: PointsTransactionType;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}

