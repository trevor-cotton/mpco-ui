import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintQueueController } from './print-queue.controller';
import { PrintQueueService } from './print-queue.service';
import { PrintQueue } from '../../entities/print-queue.entity';
import { PrintJob } from '../../entities/print-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintQueue, PrintJob])],
  controllers: [PrintQueueController],
  providers: [PrintQueueService],
  exports: [PrintQueueService],
})
export class PrintQueueModule {}

