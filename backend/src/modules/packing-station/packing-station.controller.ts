import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PackingStationService } from './packing-station.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('packing')
@UseGuards(JwtAuthGuard)
export class PackingStationController {
  constructor(private packingStationService: PackingStationService) {}

  @Get('orders')
  async getOrdersReadyToPack() {
    return this.packingStationService.getOrdersReadyToPack();
  }

  @Post('scan')
  async scanOrder(@Body('orderIdOrBarcode') orderIdOrBarcode: string) {
    return this.packingStationService.scanOrder(orderIdOrBarcode);
  }

  @Post('verify')
  async verifyOrderContents(
    @Body('orderId') orderId: string,
    @Body('items') items: Array<{ sku: string; quantity: number }>,
  ) {
    return this.packingStationService.verifyOrderContents(orderId, items);
  }

  @Post('complete')
  async completePacking(
    @Request() req: any,
    @Body('orderId') orderId: string,
    @Body('verified') verified: boolean = true,
  ) {
    return this.packingStationService.completePacking(orderId, req.user.id, verified);
  }
}

