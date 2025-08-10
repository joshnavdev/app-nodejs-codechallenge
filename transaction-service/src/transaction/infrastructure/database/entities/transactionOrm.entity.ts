import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionTypeOrmEntity } from './transactionTypeOrm.entity';
import { TransactionStatusOrmEntity } from './transactionStatusOrm.entity';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_id' })
  id: string;

  @Column({ name: 'account_external_id_debit' })
  accountingExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountingExternalIdCredit: string;

  @ManyToOne(() => TransactionTypeOrmEntity)
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionTypeOrmEntity;

  @ManyToOne(() => TransactionStatusOrmEntity)
  @JoinColumn({ name: 'transaction_status_id' })
  transactionStatus: TransactionStatusOrmEntity;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
