import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { ErrorLog } from '../../entities/error-log.entity';
import { Order } from '../../entities/order.entity';
import { PointsSystemModule } from '../points-system/points-system.module';
import { MissingItemSupportModule } from '../missing-item-support/missing-item-support.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ErrorLog, Order]),
    PointsSystemModule,
    MissingItemSupportModule,
  ],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
  exports: [CustomerServiceService],
})
export class CustomerServiceModule {}

