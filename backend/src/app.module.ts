import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrderProcessingModule } from './modules/order-processing/order-processing.module';
import { PrintQueueModule } from './modules/print-queue/print-queue.module';
import { PrintingModule } from './modules/printing/printing.module';
import { LabelPrintingModule } from './modules/label-printing/label-printing.module';
import { PackingStationModule } from './modules/packing-station/packing-station.module';
import { PointsSystemModule } from './modules/points-system/points-system.module';
import { CustomerServiceModule } from './modules/customer-service/customer-service.module';
import { MissingItemSupportModule } from './modules/missing-item-support/missing-item-support.module';
import { AdminPanelModule } from './modules/admin-panel/admin-panel.module';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { PrintJob } from './entities/print-job.entity';
import { PrintQueue } from './entities/print-queue.entity';
import { PrintedSheet } from './entities/printed-sheet.entity';
import { ShippingLabel } from './entities/shipping-label.entity';
import { PackedOrder } from './entities/packed-order.entity';
import { PointsTransaction } from './entities/points-transaction.entity';
import { ErrorLog } from './entities/error-log.entity';
import { Printer } from './entities/printer.entity';
import { SystemConfig } from './entities/system-config.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'mpco',
      entities: [
        User,
        Order,
        PrintJob,
        PrintQueue,
        PrintedSheet,
        ShippingLabel,
        PackedOrder,
        PointsTransaction,
        ErrorLog,
        Printer,
        SystemConfig,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    OrderProcessingModule,
    PrintQueueModule,
    PrintingModule,
    LabelPrintingModule,
    PackingStationModule,
    PointsSystemModule,
    CustomerServiceModule,
    MissingItemSupportModule,
    AdminPanelModule,
  ],
})
export class AppModule {}

