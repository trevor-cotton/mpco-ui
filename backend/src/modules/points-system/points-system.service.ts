import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointsTransaction, PointsTransactionType } from '../../entities/points-transaction.entity';
import { User } from '../../entities/user.entity';
import { SystemConfig } from '../../entities/system-config.entity';

@Injectable()
export class PointsSystemService {
  private readonly logger = new Logger(PointsSystemService.name);

  constructor(
    @InjectRepository(PointsTransaction)
    private pointsTransactionRepository: Repository<PointsTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SystemConfig)
    private systemConfigRepository: Repository<SystemConfig>,
  ) {}

  async getPointsPerOrder(): Promise<number> {
    const config = await this.systemConfigRepository.findOne({
      where: { key: 'points_per_order' },
    });
    return config ? parseInt(config.value) : 10; // Default 10 points
  }

  async getPenaltyPoints(): Promise<number> {
    const config = await this.systemConfigRepository.findOne({
      where: { key: 'penalty_points' },
    });
    return config ? parseInt(config.value) : 5; // Default 5 point penalty
  }

  async awardPoints(packerId: string, orderId: string): Promise<PointsTransaction> {
    const points = await this.getPointsPerOrder();

    const transaction = this.pointsTransactionRepository.create({
      packerId,
      orderId,
      points,
      type: PointsTransactionType.AWARD,
      description: `Points awarded for packing order`,
    });

    return this.pointsTransactionRepository.save(transaction);
  }

  async deductPoints(packerId: string, orderId: string, reason: string): Promise<PointsTransaction> {
    const penaltyPoints = await this.getPenaltyPoints();

    const transaction = this.pointsTransactionRepository.create({
      packerId,
      orderId,
      points: -penaltyPoints,
      type: PointsTransactionType.PENALTY,
      description: reason,
    });

    return this.pointsTransactionRepository.save(transaction);
  }

  async getPackerPoints(packerId: string): Promise<number> {
    const result = await this.pointsTransactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.points)', 'total')
      .where('transaction.packerId = :packerId', { packerId })
      .getRawOne();

    return parseInt(result?.total || '0');
  }

  async getLeaderboard(): Promise<Array<{ packer: User; totalPoints: number }>> {
    const packers = await this.userRepository.find({
      where: { role: 'team_member' as any },
    });

    const leaderboard = await Promise.all(
      packers.map(async (packer) => ({
        packer,
        totalPoints: await this.getPackerPoints(packer.id),
      })),
    );

    return leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async getPackerTransactions(packerId: string): Promise<PointsTransaction[]> {
    return this.pointsTransactionRepository.find({
      where: { packerId },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }
}

