import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { OrderProcessingService } from './order-processing.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('webhooks')
export class OrderProcessingController {
  constructor(private orderProcessingService: OrderProcessingService) {}

  @Post('shopify')
  async handleShopifyWebhook(@Body() webhookData: any) {
    return this.orderProcessingService.processShopifyWebhook(webhookData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrders() {
    return this.orderProcessingService.getOrders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  async getOrderById(@Param('id') id: string) {
    return this.orderProcessingService.getOrderById(id);
  }
}

