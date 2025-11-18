import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissingItemSupportController } from './missing-item-support.controller';
import { MissingItemSupportService } from './missing-item-support.service';
import { Order } from '../../entities/order.entity';
import { PrintJob } from '../../entities/print-job.entity';
import { PrintQueue } from '../../entities/print-queue.entity';
import { ShopifyService } from '../../integrations/shopify.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PrintJob, PrintQueue])],
  controllers: [MissingItemSupportController],
  providers: [MissingItemSupportService, ShopifyService],
  exports: [MissingItemSupportService],
})
export class MissingItemSupportModule {}

