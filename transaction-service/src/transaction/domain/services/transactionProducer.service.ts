import { TransactionEntity } from '../entities/transaction.entity';
import { CreateTransaction } from '../dtos/createTransaction';

export interface TransactionProducerService {
  emitTransactionCreate(transaction: CreateTransaction): Promise<TransactionEntity>;
  emitTransactionValidation(transaction: TransactionEntity): void;
}
