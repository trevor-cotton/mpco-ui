import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { PrintJob, PrintJobStatus } from '../../entities/print-job.entity';
import { PrintQueue, PrintQueueStatus } from '../../entities/print-queue.entity';
import { ShopifyService } from '../../integrations/shopify.service';

@Injectable()
export class MissingItemSupportService {
  private readonly logger = new Logger(MissingItemSupportService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(PrintJob)
    private printJobRepository: Repository<PrintJob>,
    @InjectRepository(PrintQueue)
    private printQueueRepository: Repository<PrintQueue>,
    private shopifyService: ShopifyService,
  ) {}

  async createReprintJob(orderId: string, sku: string): Promise<PrintJob> {
    this.logger.log(`Creating reprint job for order ${orderId}, SKU ${sku}`);

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Find the original print job to get product info
    const originalPrintJob = await this.printJobRepository.findOne({
      where: { orderId, sku },
    });

    let printFileUrl: string;
    if (originalPrintJob) {
      printFileUrl = originalPrintJob.printFileUrl;
    } else {
      // Fetch from Shopify if not found
      const orderData = order.orderData;
      const lineItem = orderData?.line_items?.find((item: any) => item.sku === sku);
      if (lineItem) {
        printFileUrl = await this.shopifyService.getProductFileUrl(
          lineItem.product_id,
          lineItem.variant_id,
        );
      } else {
        throw new Error('SKU not found in order');
      }
    }

    // Create new print job
    const printJob = this.printJobRepository.create({
      orderId: order.id,
      sku,
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

    return savedPrintJob;
  }

  async scanOrderForReprint(orderIdOrBarcode: string): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: { id: orderIdOrBarcode },
      relations: ['printJobs'],
    });

    if (!order) {
      order = await this.orderRepository.findOne({
        where: { shopifyOrderId: orderIdOrBarcode },
        relations: ['printJobs'],
      });
    }

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}

