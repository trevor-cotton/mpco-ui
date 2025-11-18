import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProcessingController } from './order-processing.controller';
import { OrderProcessingService } from './order-processing.service';
import { Order } from '../../entities/order.entity';
import { PrintJob } from '../../entities/print-job.entity';
import { PrintQueue } from '../../entities/print-queue.entity';
import { ShopifyService } from '../../integrations/shopify.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PrintJob, PrintQueue])],
  controllers: [OrderProcessingController],
  providers: [OrderProcessingService, ShopifyService],
  exports: [OrderProcessingService],
})
export class OrderProcessingModule {}

