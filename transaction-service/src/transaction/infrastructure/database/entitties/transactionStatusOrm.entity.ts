import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TransactionStatusEnum } from '../../../domain/entities/transactionStatus.entity';

@Entity('transaction_statuses')
export default class TransactionStatusOrmEntity {
  @PrimaryColumn({ name: 'transaction_status_id' })
  id: number;

  @Column({ name: 'name', unique: true })
  name: TransactionStatusEnum;
}
