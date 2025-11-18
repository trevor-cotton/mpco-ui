import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrintQueue, PrintQueueStatus } from '../../entities/print-queue.entity';
import { PrintedSheet } from '../../entities/printed-sheet.entity';
import { Printer } from '../../entities/printer.entity';
import { PrintJob, PrintJobStatus } from '../../entities/print-job.entity';
import { PrinterService } from '../../integrations/printer.service';
import { LabelPrintingService } from '../label-printing/label-printing.service';

@Injectable()
export class PrintingService {
  private readonly logger = new Logger(PrintingService.name);

  constructor(
    @InjectRepository(PrintQueue)
    private printQueueRepository: Repository<PrintQueue>,
    @InjectRepository(PrintedSheet)
    private printedSheetRepository: Repository<PrintedSheet>,
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    @InjectRepository(PrintJob)
    private printJobRepository: Repository<PrintJob>,
    private printerService: PrinterService,
    private labelPrintingService: LabelPrintingService,
  ) {}

  async printBatch(batchId: string, printerId: string): Promise<boolean> {
    this.logger.log(`Printing batch ${batchId} on printer ${printerId}`);

    const printer = await this.printerRepository.findOne({
      where: { id: printerId },
    });

    if (!printer) {
      throw new Error('Printer not found');
    }

    const printQueues = await this.printQueueRepository.find({
      where: { batchId, status: PrintQueueStatus.BATCHED },
      relations: ['printJob'],
    });

    const printJobs = printQueues.map((pq) => ({
      fileUrl: pq.printJob.printFileUrl,
      jobId: pq.id,
    }));

    const success = await this.printerService.batchPrint(printer, printJobs);

    if (success) {
      for (const printQueue of printQueues) {
        printQueue.status = PrintQueueStatus.COMPLETED;
        await this.printQueueRepository.save(printQueue);

        printQueue.printJob.status = PrintJobStatus.COMPLETED;
        await this.printJobRepository.save(printQueue.printJob);

        const printedSheet = this.printedSheetRepository.create({
          printQueueId: printQueue.id,
          printerId: printer.id,
        });
        await this.printedSheetRepository.save(printedSheet);
      }

      // Notify LabelPrinting module
      const orderIds = [...new Set(printQueues.map((pq) => pq.printJob.orderId))];
      for (const orderId of orderIds) {
        await this.labelPrintingService.notifyPrintComplete(orderId);
      }
    }

    return success;
  }

  async printSingleJob(printQueueId: string, printerId: string): Promise<boolean> {
    const printQueue = await this.printQueueRepository.findOne({
      where: { id: printQueueId },
      relations: ['printJob'],
    });

    if (!printQueue) {
      throw new Error('Print queue item not found');
    }

    const printer = await this.printerRepository.findOne({
      where: { id: printerId },
    });

    if (!printer) {
      throw new Error('Printer not found');
    }

    const success = await this.printerService.sendPrintJob(
      printer,
      printQueue.printJob.printFileUrl,
      printQueue.id,
    );

    if (success) {
      printQueue.status = PrintQueueStatus.COMPLETED;
      await this.printQueueRepository.save(printQueue);

      printQueue.printJob.status = PrintJobStatus.COMPLETED;
      await this.printJobRepository.save(printQueue.printJob);

      const printedSheet = this.printedSheetRepository.create({
        printQueueId: printQueue.id,
        printerId: printer.id,
      });
      await this.printedSheetRepository.save(printedSheet);

      await this.labelPrintingService.notifyPrintComplete(printQueue.printJob.orderId);
    }

    return success;
  }
}

