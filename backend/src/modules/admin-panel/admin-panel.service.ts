import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Printer, PrinterStatus } from '../../entities/printer.entity';
import { SystemConfig } from '../../entities/system-config.entity';
import { User, UserRole } from '../../entities/user.entity';
import { Order } from '../../entities/order.entity';
import { PrintJob } from '../../entities/print-job.entity';
import { PackedOrder } from '../../entities/packed-order.entity';
import { ErrorLog } from '../../entities/error-log.entity';
import { PointsTransaction } from '../../entities/points-transaction.entity';

@Injectable()
export class AdminPanelService {
  private readonly logger = new Logger(AdminPanelService.name);

  constructor(
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    @InjectRepository(SystemConfig)
    private systemConfigRepository: Repository<SystemConfig>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(PrintJob)
    private printJobRepository: Repository<PrintJob>,
    @InjectRepository(PackedOrder)
    private packedOrderRepository: Repository<PackedOrder>,
    @InjectRepository(ErrorLog)
    private errorLogRepository: Repository<ErrorLog>,
    @InjectRepository(PointsTransaction)
    private pointsTransactionRepository: Repository<PointsTransaction>,
  ) {}

  // Printer Management
  async createPrinter(name: string, apiEndpoint: string, settings?: any): Promise<Printer> {
    const printer = this.printerRepository.create({
      name,
      apiEndpoint,
      status: PrinterStatus.ACTIVE,
      settings,
    });
    return this.printerRepository.save(printer);
  }

  async getPrinters(): Promise<Printer[]> {
    return this.printerRepository.find();
  }

  async updatePrinter(id: string, updates: Partial<Printer>): Promise<Printer> {
    await this.printerRepository.update(id, updates);
    return this.printerRepository.findOne({ where: { id } });
  }

  async deletePrinter(id: string): Promise<void> {
    await this.printerRepository.delete(id);
  }

  // System Configuration
  async setConfig(key: string, value: string, description?: string): Promise<SystemConfig> {
    let config = await this.systemConfigRepository.findOne({ where: { key } });
    
    if (config) {
      config.value = value;
      if (description) config.description = description;
    } else {
      config = this.systemConfigRepository.create({ key, value, description });
    }
    
    return this.systemConfigRepository.save(config);
  }

  async getConfig(key: string): Promise<SystemConfig> {
    return this.systemConfigRepository.findOne({ where: { key } });
  }

  async getAllConfigs(): Promise<SystemConfig[]> {
    return this.systemConfigRepository.find();
  }

  // User Management
  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ select: ['id', 'email', 'role', 'createdAt'] });
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    await this.userRepository.update(userId, { role });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }

  // Reporting
  async getDashboardStats(): Promise<any> {
    const [
      totalOrders,
      pendingOrders,
      packedOrders,
      totalPrintJobs,
      completedPrintJobs,
      totalErrors,
      unresolvedErrors,
    ] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: 'pending' as any } }),
      this.packedOrderRepository.count(),
      this.printJobRepository.count(),
      this.printJobRepository.count({ where: { status: 'completed' as any } }),
      this.errorLogRepository.count(),
      this.errorLogRepository.count({ where: { resolved: false } }),
    ]);

    return {
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        packed: packedOrders,
      },
      printing: {
        total: totalPrintJobs,
        completed: completedPrintJobs,
      },
      errors: {
        total: totalErrors,
        unresolved: unresolvedErrors,
      },
    };
  }

  async getOrderAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    const query = this.orderRepository.createQueryBuilder('order');
    
    if (startDate) {
      query.andWhere('order.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('order.createdAt <= :endDate', { endDate });
    }

    const orders = await query.getMany();
    
    return {
      total: orders.length,
      byStatus: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async getPackerPerformance(): Promise<any> {
    const packers = await this.userRepository.find({
      where: { role: UserRole.TEAM_MEMBER },
    });

    const performance = await Promise.all(
      packers.map(async (packer) => {
        const [packedCount, errorCount] = await Promise.all([
          this.packedOrderRepository.count({ where: { packerId: packer.id } }),
          this.errorLogRepository.count({ where: { packerId: packer.id } }),
        ]);

        return {
          packer: { id: packer.id, email: packer.email },
          packedCount,
          errorCount,
          accuracy: packedCount > 0 ? ((packedCount - errorCount) / packedCount) * 100 : 0,
        };
      }),
    );

    return performance;
  }
}

