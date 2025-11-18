import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PrintJob } from './print-job.entity';
import { ShippingLabel } from './shipping-label.entity';
import { PackedOrder } from './packed-order.entity';
import { ErrorLog } from './error-log.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PRINTED = 'printed',
  LABELED = 'labeled',
  READY_TO_PACK = 'ready_to_pack',
  PACKED = 'packed',
  SHIPPED = 'shipped',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  shopifyOrderId: string;

  @Column('jsonb')
  orderData: any;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PrintJob, (printJob) => printJob.order)
  printJobs: PrintJob[];

  @OneToMany(() => ShippingLabel, (label) => label.order)
  shippingLabels: ShippingLabel[];

  @OneToMany(() => PackedOrder, (packedOrder) => packedOrder.order)
  packedOrders: PackedOrder[];

  @OneToMany(() => ErrorLog, (errorLog) => errorLog.order)
  errorLogs: ErrorLog[];
}

