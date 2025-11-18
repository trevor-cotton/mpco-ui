import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { LabelPrintingService } from './label-printing.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('labels')
@UseGuards(JwtAuthGuard)
export class LabelPrintingController {
  constructor(private labelPrintingService: LabelPrintingService) {}

  @Post('generate/:orderId')
  async generateLabel(@Param('orderId') orderId: string) {
    return this.labelPrintingService.generateShippingLabel(orderId);
  }

  @Get(':orderId')
  async getLabel(@Param('orderId') orderId: string) {
    return this.labelPrintingService.getShippingLabel(orderId);
  }
}

