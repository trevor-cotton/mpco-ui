import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintingController } from './printing.controller';
import { PrintingService } from './printing.service';
import { PrintQueue } from '../../entities/print-queue.entity';
import { PrintedSheet } from '../../entities/printed-sheet.entity';
import { Printer } from '../../entities/printer.entity';
import { PrinterService } from '../../integrations/printer.service';
import { LabelPrintingModule } from '../label-printing/label-printing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrintQueue, PrintedSheet, Printer]),
    LabelPrintingModule,
  ],
  controllers: [PrintingController],
  providers: [PrintingService, PrinterService],
  exports: [PrintingService],
})
export class PrintingModule {}

