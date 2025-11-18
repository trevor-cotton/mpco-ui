import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PointsSystemService } from './points-system.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsSystemController {
  constructor(private pointsSystemService: PointsSystemService) {}

  @Get('packer/:packerId')
  async getPackerPoints(@Param('packerId') packerId: string) {
    const totalPoints = await this.pointsSystemService.getPackerPoints(packerId);
    return { packerId, totalPoints };
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.pointsSystemService.getLeaderboard();
  }

  @Get('packer/:packerId/transactions')
  async getPackerTransactions(@Param('packerId') packerId: string) {
    return this.pointsSystemService.getPackerTransactions(packerId);
  }
}

