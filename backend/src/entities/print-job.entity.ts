import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { PrintQueue } from './print-queue.entity';

export enum PrintJobStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  PRINTING = 'printing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('print_jobs')
export class PrintJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.printJobs)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  sku: string;

  @Column()
  printFileUrl: string;

  @Column({
    type: 'enum',
    enum: PrintJobStatus,
    default: PrintJobStatus.PENDING,
  })
  status: PrintJobStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => PrintQueue, (printQueue) => printQueue.printJob)
  printQueue: PrintQueue;
}

