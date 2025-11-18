import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPanelController } from './admin-panel.controller';
import { AdminPanelService } from './admin-panel.service';
import { Printer } from '../../entities/printer.entity';
import { SystemConfig } from '../../entities/system-config.entity';
import { User } from '../../entities/user.entity';
import { Order } from '../../entities/order.entity';
import { PrintJob } from '../../entities/print-job.entity';
import { PackedOrder } from '../../entities/packed-order.entity';
import { ErrorLog } from '../../entities/error-log.entity';
import { PointsTransaction } from '../../entities/points-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Printer,
      SystemConfig,
      User,
      Order,
      PrintJob,
      PackedOrder,
      ErrorLog,
      PointsTransaction,
    ]),
  ],
  controllers: [AdminPanelController],
  providers: [AdminPanelService],
  exports: [AdminPanelService],
})
export class AdminPanelModule {}

