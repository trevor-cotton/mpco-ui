import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingLabel } from '../../entities/shipping-label.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { ShipStationService } from '../../integrations/shipstation.service';

@Injectable()
export class LabelPrintingService {
  private readonly logger = new Logger(LabelPrintingService.name);

  constructor(
    @InjectRepository(ShippingLabel)
    private shippingLabelRepository: Repository<ShippingLabel>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private shipStationService: ShipStationService,
  ) {}

  async notifyPrintComplete(orderId: string): Promise<void> {
    this.logger.log(`Print complete notification for order ${orderId}`);
    
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      return;
    }

    // Generate shipping label
    await this.generateShippingLabel(orderId);
  }

  async generateShippingLabel(orderId: string): Promise<ShippingLabel> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Check if label already exists
    const existingLabel = await this.shippingLabelRepository.findOne({
      where: { orderId },
    });

    if (existingLabel) {
      return existingLabel;
    }

    // Create label via ShipStation
    const { labelUrl, shipstationId } = await this.shipStationService.createShippingLabel(
      order.orderData,
    );

    const shippingLabel = this.shippingLabelRepository.create({
      orderId: order.id,
      labelUrl,
      shipstationId,
    });

    const savedLabel = await this.shippingLabelRepository.save(shippingLabel);

    // Update order status
    order.status = OrderStatus.READY_TO_PACK;
    await this.orderRepository.save(order);

    return savedLabel;
  }

  async getShippingLabel(orderId: string): Promise<ShippingLabel | null> {
    return this.shippingLabelRepository.findOne({
      where: { orderId },
    });
  }
}

