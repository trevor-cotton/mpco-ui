import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackingStationController } from './packing-station.controller';
import { PackingStationService } from './packing-station.service';
import { PackedOrder } from '../../entities/packed-order.entity';
import { Order } from '../../entities/order.entity';
import { PointsSystemModule } from '../points-system/points-system.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PackedOrder, Order]),
    PointsSystemModule,
  ],
  controllers: [PackingStationController],
  providers: [PackingStationService],
  exports: [PackingStationService],
})
export class PackingStationModule {}

