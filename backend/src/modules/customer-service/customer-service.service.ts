import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog, ErrorType } from '../../entities/error-log.entity';
import { Order } from '../../entities/order.entity';
import { PointsSystemService } from '../points-system/points-system.service';
import { MissingItemSupportService } from '../missing-item-support/missing-item-support.service';

@Injectable()
export class CustomerServiceService {
  private readonly logger = new Logger(CustomerServiceService.name);

  constructor(
    @InjectRepository(ErrorLog)
    private errorLogRepository: Repository<ErrorLog>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private pointsSystemService: PointsSystemService,
    private missingItemSupportService: MissingItemSupportService,
  ) {}

  async logError(
    orderId: string,
    errorType: ErrorType,
    description: string,
    packerId?: string,
  ): Promise<ErrorLog> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const errorLog = this.errorLogRepository.create({
      orderId: order.id,
      packerId,
      errorType,
      description,
      resolved: false,
    });

    const savedErrorLog = await this.errorLogRepository.save(errorLog);

    // If it's a packing error and packer is identified, deduct points
    if (packerId && (errorType === ErrorType.MISPick || errorType === ErrorType.MISSING)) {
      await this.pointsSystemService.deductPoints(
        packerId,
        orderId,
        `Penalty for ${errorType}: ${description}`,
      );
    }

    // If item is missing or damaged, trigger reprint
    if (errorType === ErrorType.MISSING || errorType === ErrorType.DAMAGED) {
      // Extract SKU from description or order
      const orderData = order.orderData;
      if (orderData?.line_items && orderData.line_items.length > 0) {
        for (const item of orderData.line_items) {
          await this.missingItemSupportService.createReprintJob(orderId, item.sku);
        }
      }
    }

    return savedErrorLog;
  }

  async getErrors(resolved?: boolean): Promise<ErrorLog[]> {
    const where: any = {};
    if (resolved !== undefined) {
      where.resolved = resolved;
    }

    return this.errorLogRepository.find({
      where,
      relations: ['order', 'packer'],
      order: { createdAt: 'DESC' },
    });
  }

  async resolveError(errorLogId: string): Promise<ErrorLog> {
    const errorLog = await this.errorLogRepository.findOne({
      where: { id: errorLogId },
    });

    if (!errorLog) {
      throw new Error('Error log not found');
    }

    errorLog.resolved = true;
    return this.errorLogRepository.save(errorLog);
  }
}

