import TransactionEntity from '../entities/transaction.entity';

export default interface TransactionProducerService {
  emitTransactionValidation(transaction: TransactionEntity): void;
}
