import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PrintingService } from './printing.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('printing')
@UseGuards(JwtAuthGuard)
export class PrintingController {
  constructor(private printingService: PrintingService) {}

  @Post('batch/:batchId')
  async printBatch(
    @Param('batchId') batchId: string,
    @Body('printerId') printerId: string,
  ) {
    return this.printingService.printBatch(batchId, printerId);
  }

  @Post('job/:printQueueId')
  async printSingleJob(
    @Param('printQueueId') printQueueId: string,
    @Body('printerId') printerId: string,
  ) {
    return this.printingService.printSingleJob(printQueueId, printerId);
  }
}

