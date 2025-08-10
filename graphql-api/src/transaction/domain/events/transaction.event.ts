import { CreateTransaction } from '../dtos/createTransaction';
import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionEvent {
  emitTransactionCreate(transaction: CreateTransaction): Promise<TransactionEntity>;
  emitTransactionGetById(id: string): Promise<TransactionEntity>;
}
