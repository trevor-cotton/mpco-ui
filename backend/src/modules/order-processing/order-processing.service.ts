import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { PrintJob, PrintJobStatus } from '../../entities/print-job.entity';
import { PrintQueue, PrintQueueStatus } from '../../entities/print-queue.entity';
import { ShopifyService } from '../../integrations/shopify.service';

@Injectable()
export class OrderProcessingService {
  private readonly logger = new Logger(OrderProcessingService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(PrintJob)
    private printJobRepository: Repository<PrintJob>,
    @InjectRepository(PrintQueue)
    private printQueueRepository: Repository<PrintQueue>,
    private shopifyService: ShopifyService,
  ) {}

  async processShopifyWebhook(webhookData: any): Promise<Order> {
    this.logger.log(`Processing Shopify webhook for order ${webhookData.id}`);

    // Validate webhook (placeholder)
    await this.shopifyService.validateWebhook(webhookData, webhookData.hmac);

    // Create or update order
    let order = await this.orderRepository.findOne({
      where: { shopifyOrderId: webhookData.id.toString() },
    });

    if (!order) {
      order = this.orderRepository.create({
        shopifyOrderId: webhookData.id.toString(),
        orderData: webhookData,
        status: OrderStatus.PENDING,
      });
      order = await this.orderRepository.save(order);
    }

    // Create print jobs for each line item
    if (webhookData.line_items && webhookData.line_items.length > 0) {
      for (const item of webhookData.line_items) {
        const printFileUrl = await this.shopifyService.getProductFileUrl(
          item.product_id,
          item.variant_id,
        );

        const printJob = this.printJobRepository.create({
          orderId: order.id,
          sku: item.sku,
          printFileUrl,
          status: PrintJobStatus.PENDING,
        });
        const savedPrintJob = await this.printJobRepository.save(printJob);

        // Add to print queue
        const printQueue = this.printQueueRepository.create({
          printJobId: savedPrintJob.id,
          status: PrintQueueStatus.PENDING,
        });
        await this.printQueueRepository.save(printQueue);
      }
    }

    order.status = OrderStatus.PROCESSING;
    return this.orderRepository.save(order);
  }

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['printJobs', 'shippingLabels', 'packedOrders'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['printJobs', 'shippingLabels', 'packedOrders', 'errorLogs'],
    });
  }
}

