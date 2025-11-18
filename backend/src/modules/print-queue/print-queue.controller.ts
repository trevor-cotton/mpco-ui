import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PrintQueueService } from './print-queue.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('print-queue')
@UseGuards(JwtAuthGuard)
export class PrintQueueController {
  constructor(private printQueueService: PrintQueueService) {}

  @Get()
  async getPendingJobs() {
    return this.printQueueService.getPendingJobs();
  }

  @Get('all')
  async getAllJobs() {
    return this.printQueueService.getAllJobs();
  }

  @Post('batch')
  async createBatch(@Body('jobIds') jobIds: string[]) {
    return this.printQueueService.createBatch(jobIds);
  }

  @Get('batch/:batchId')
  async getBatchJobs(@Param('batchId') batchId: string) {
    return this.printQueueService.getBatchJobs(batchId);
  }
}

