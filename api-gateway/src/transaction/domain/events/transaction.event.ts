import TransactionEntity from '../entities/transaction.entity';
import CreateTransaction from '../dtos/createTransaction';

export default interface TransactionEvent {
  emitTransactionCreate(transaction: CreateTransaction): Promise<TransactionEntity>;
  emitTransactionValidation(transaction: TransactionEntity): void;
  emitTransactionGetById(id: string): Promise<TransactionEntity>;
}
