import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackedOrder } from '../../entities/packed-order.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { PointsSystemService } from '../points-system/points-system.service';

@Injectable()
export class PackingStationService {
  private readonly logger = new Logger(PackingStationService.name);

  constructor(
    @InjectRepository(PackedOrder)
    private packedOrderRepository: Repository<PackedOrder>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private pointsSystemService: PointsSystemService,
  ) {}

  async getOrdersReadyToPack(): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: OrderStatus.READY_TO_PACK },
      relations: ['printJobs', 'shippingLabels'],
      order: { createdAt: 'ASC' },
    });
  }

  async scanOrder(orderIdOrBarcode: string): Promise<Order> {
    // Try to find by ID first, then by Shopify order ID
    let order = await this.orderRepository.findOne({
      where: { id: orderIdOrBarcode },
      relations: ['printJobs', 'shippingLabels'],
    });

    if (!order) {
      order = await this.orderRepository.findOne({
        where: { shopifyOrderId: orderIdOrBarcode },
        relations: ['printJobs', 'shippingLabels'],
      });
    }

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async verifyOrderContents(orderId: string, items: Array<{ sku: string; quantity: number }>): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['printJobs'],
    });

    if (!order) {
      return false;
    }

    // Verify items match order
    const orderItems = order.printJobs.map((pj) => pj.sku);
    const scannedItems = items.map((item) => item.sku);

    return orderItems.every((sku) => scannedItems.includes(sku)) &&
           scannedItems.every((sku) => orderItems.includes(sku));
  }

  async completePacking(orderId: string, packerId: string, verified: boolean = true): Promise<PackedOrder> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const packedOrder = this.packedOrderRepository.create({
      orderId: order.id,
      packerId,
      verified,
    });

    const savedPackedOrder = await this.packedOrderRepository.save(packedOrder);

    // Update order status
    order.status = OrderStatus.PACKED;
    await this.orderRepository.save(order);

    // Award points to packer
    if (verified) {
      await this.pointsSystemService.awardPoints(packerId, orderId);
    }

    return savedPackedOrder;
  }
}

