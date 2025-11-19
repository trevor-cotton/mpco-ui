import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
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
    // Validate input
    if (!jobIds || jobIds.length === 0) {
      throw new BadRequestException('At least one job ID must be provided');
    }

    if (jobIds.length > 50) {
      throw new BadRequestException('Cannot batch more than 50 jobs at once');
    }

    const batchId = `batch-${Date.now()}`;

    // Use transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedJobs: PrintQueue[] = [];

      for (const jobId of jobIds) {
        const printQueue = await queryRunner.manager.findOne(PrintQueue, {
          where: { id: jobId },
        });

        if (!printQueue) {
          throw new NotFoundException(`Print queue job with ID ${jobId} not found`);
        }

        if (printQueue.status !== PrintQueueStatus.PENDING) {
          throw new BadRequestException(`Job ${jobId} is not in PENDING status`);
        }

        if (printQueue.batchId) {
          throw new BadRequestException(`Job ${jobId} is already part of another batch`);
        }

        printQueue.batchId = batchId;
        printQueue.status = PrintQueueStatus.BATCHED;
        updatedJobs.push(printQueue);
      }

      // Save all jobs in the transaction
      await queryRunner.manager.save(PrintQueue, updatedJobs);

      await queryRunner.commitTransaction();
      this.logger.log(`Created batch ${batchId} with ${jobIds.length} jobs`);

      return batchId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create batch: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBatchJobs(batchId: string): Promise<PrintQueue[]> {
    return this.printQueueRepository.find({
      where: { batchId },
      relations: ['printJob', 'printJob.order'],
    });
  }
}

