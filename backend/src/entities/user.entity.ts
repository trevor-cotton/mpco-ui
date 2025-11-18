import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PackedOrder } from './packed-order.entity';
import { PointsTransaction } from './points-transaction.entity';
import { ErrorLog } from './error-log.entity';

export enum UserRole {
  ADMIN = 'admin',
  TEAM_MEMBER = 'team_member',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TEAM_MEMBER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PackedOrder, (packedOrder) => packedOrder.packer)
  packedOrders: PackedOrder[];

  @OneToMany(() => PointsTransaction, (transaction) => transaction.packer)
  pointsTransactions: PointsTransaction[];

  @OneToMany(() => ErrorLog, (errorLog) => errorLog.packer)
  errorLogs: ErrorLog[];
}

