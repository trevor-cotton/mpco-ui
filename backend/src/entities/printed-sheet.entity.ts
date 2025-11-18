import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PrintQueue } from './print-queue.entity';
import { Printer } from './printer.entity';

@Entity('printed_sheets')
export class PrintedSheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  printQueueId: string;

  @ManyToOne(() => PrintQueue, (printQueue) => printQueue.printedSheets)
  @JoinColumn({ name: 'printQueueId' })
  printQueue: PrintQueue;

  @Column()
  printerId: string;

  @ManyToOne(() => Printer)
  @JoinColumn({ name: 'printerId' })
  printer: Printer;

  @CreateDateColumn()
  printedAt: Date;
}

