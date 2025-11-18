import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelPrintingController } from './label-printing.controller';
import { LabelPrintingService } from './label-printing.service';
import { ShippingLabel } from '../../entities/shipping-label.entity';
import { Order } from '../../entities/order.entity';
import { ShipStationService } from '../../integrations/shipstation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingLabel, Order])],
  controllers: [LabelPrintingController],
  providers: [LabelPrintingService, ShipStationService],
  exports: [LabelPrintingService],
})
export class LabelPrintingModule {}

