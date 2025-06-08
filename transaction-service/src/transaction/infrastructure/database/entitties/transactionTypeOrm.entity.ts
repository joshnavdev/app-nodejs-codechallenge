import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TransactionTypeEnum } from '../../../domain/entities/transactionType.entity';

@Entity('transaction_types')
export default class TransactionTypeOrmEntity {
  @PrimaryColumn({ name: 'transaction_type_id' })
  id: number;

  @Column({ name: 'name', unique: true })
  name: TransactionTypeEnum;
}
