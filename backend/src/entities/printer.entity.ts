import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PrintedSheet } from './printed-sheet.entity';

export enum PrinterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('printers')
export class Printer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  apiEndpoint: string;

  @Column({
    type: 'enum',
    enum: PrinterStatus,
    default: PrinterStatus.ACTIVE,
  })
  status: PrinterStatus;

  @Column('jsonb', { nullable: true })
  settings: any;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PrintedSheet, (printedSheet) => printedSheet.printer)
  printedSheets: PrintedSheet[];
}

