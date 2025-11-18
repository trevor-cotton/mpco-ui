import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrintQueue, PrintQueueStatus } from '../../entities/print-queue.entity';
import { PrintJob, PrintJobStatus } from '../../entities/print-job.entity';

@Injectable()
export class PrintQueueService {
  private readonly logger = new Logger(PrintQueueService.name);

  constructor(
    @InjectRepository(PrintQueue)
    private printQueueRepository: Repository<PrintQueue>,
    @InjectRepository(PrintJob)
    private printJobRepository: Repository<PrintJob>,
  ) {}

  async getPendingJobs(): Promise<PrintQueue[]> {
    return this.printQueueRepository.find({
      where: { status: PrintQueueStatus.PENDING },
      relations: ['printJob', 'printJob.order'],
      order: { createdAt: 'ASC' },
    });
  }

  async getAllJobs(): Promise<PrintQueue[]> {
    return this.printQueueRepository.find({
      relations: ['printJob', 'printJob.order'],
      order: { createdAt: 'DESC' },
    });
  }

  async createBatch(jobIds: string[]): Promise<string> {
    const batchId = `batch-${Date.now()}`;
    
    for (const jobId of jobIds) {
      const printQueue = await this.printQueueRepository.findOne({
        where: { id: jobId },
      });
      
      if (printQueue) {
        printQueue.batchId = batchId;
        printQueue.status = PrintQueueStatus.BATCHED;
        await this.printQueueRepository.save(printQueue);
      }
    }

    return batchId;
  }

  async getBatchJobs(batchId: string): Promise<PrintQueue[]> {
    return this.printQueueRepository.find({
      where: { batchId },
      relations: ['printJob', 'printJob.order'],
    });
  }
}

