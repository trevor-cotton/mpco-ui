import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('shipping_labels')
export class ShippingLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.shippingLabels)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  labelUrl: string;

  @Column({ nullable: true })
  shipstationId: string;

  @CreateDateColumn()
  createdAt: Date;
}

