import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsSystemController } from './points-system.controller';
import { PointsSystemService } from './points-system.service';
import { PointsTransaction } from '../../entities/points-transaction.entity';
import { User } from '../../entities/user.entity';
import { SystemConfig } from '../../entities/system-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointsTransaction, User, SystemConfig])],
  controllers: [PointsSystemController],
  providers: [PointsSystemService],
  exports: [PointsSystemService],
})
export class PointsSystemModule {}

