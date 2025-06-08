import TransactionEntity from '../entities/transaction.entity';
import CreateTransaction from '../dtos/createTransaction';

export default interface TransactionProducerService {
  emitTransactionCreate(transaction: CreateTransaction): Promise<TransactionEntity>;
  emitTransactionValidation(transaction: TransactionEntity): void;
}
