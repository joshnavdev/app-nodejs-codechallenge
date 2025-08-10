import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionRepository {
  create(transaction: TransactionEntity): Promise<TransactionEntity>;
  findById(id: string): Promise<TransactionEntity | undefined>;
}
