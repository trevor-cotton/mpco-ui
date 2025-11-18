import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PrintJob } from './print-job.entity';
import { PrintedSheet } from './printed-sheet.entity';

export enum PrintQueueStatus {
  PENDING = 'pending',
  BATCHED = 'batched',
  PRINTING = 'printing',
  COMPLETED = 'completed',
}

@Entity('print_queue')
export class PrintQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  printJobId: string;

  @ManyToOne(() => PrintJob, (printJob) => printJob.printQueue)
  @JoinColumn({ name: 'printJobId' })
  printJob: PrintJob;

  @Column({
    type: 'enum',
    enum: PrintQueueStatus,
    default: PrintQueueStatus.PENDING,
  })
  status: PrintQueueStatus;

  @Column({ nullable: true })
  batchId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PrintedSheet, (printedSheet) => printedSheet.printQueue)
  printedSheets: PrintedSheet[];
}

