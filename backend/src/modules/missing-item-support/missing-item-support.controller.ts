import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MissingItemSupportService } from './missing-item-support.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('missing-items')
@UseGuards(JwtAuthGuard)
export class MissingItemSupportController {
  constructor(private missingItemSupportService: MissingItemSupportService) {}

  @Post('reprint')
  async createReprintJob(
    @Body('orderId') orderId: string,
    @Body('sku') sku: string,
  ) {
    return this.missingItemSupportService.createReprintJob(orderId, sku);
  }

  @Post('scan')
  async scanOrderForReprint(@Body('orderIdOrBarcode') orderIdOrBarcode: string) {
    return this.missingItemSupportService.scanOrderForReprint(orderIdOrBarcode);
  }
}

