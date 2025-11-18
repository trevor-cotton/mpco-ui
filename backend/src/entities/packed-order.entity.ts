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

@Entity('packed_orders')
export class PackedOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.packedOrders)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  packerId: string;

  @ManyToOne(() => User, (user) => user.packedOrders)
  @JoinColumn({ name: 'packerId' })
  packer: User;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  packedAt: Date;
}

