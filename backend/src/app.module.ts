import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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

const databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
const parsedDbUrl = databaseUrl ? new URL(databaseUrl) : undefined;

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:
        process.env.DB_HOST ||
        process.env.PGHOST ||
        parsedDbUrl?.hostname ||
        'localhost',
      port: parseInt(
        process.env.DB_PORT ||
          process.env.PGPORT ||
          parsedDbUrl?.port ||
          '5432',
        10,
      ),
      username:
        process.env.DB_USERNAME ||
        process.env.PGUSER ||
        parsedDbUrl?.username ||
        'postgres',
      password:
        process.env.DB_PASSWORD ||
        process.env.PGPASSWORD ||
        parsedDbUrl?.password ||
        'postgres',
      database:
        process.env.DB_NAME ||
        process.env.PGDATABASE ||
        parsedDbUrl?.pathname?.replace('/', '') ||
        'mpco',
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

