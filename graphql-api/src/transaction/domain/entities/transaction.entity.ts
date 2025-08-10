import { TransactionTypeEntity } from './transactionType.entity';
import { TransactionStatusEntity } from './transactionStatus.entity';

export class TransactionEntity {
  public id: string;

  constructor(
    public readonly accountingExternalIdDebit: string,
    public readonly accountingExternalIdCredit: string,
    public readonly transactionType: TransactionTypeEntity,
    public transactionStatus: TransactionStatusEntity,
    public readonly amount: number,
    public readonly createdAt: Date,
  ) {}
}
