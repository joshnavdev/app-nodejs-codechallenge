import TransactionEntity from '../entities/transaction.entity';

export default interface TransactionRepository {
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
  findById(id: string): Promise<TransactionEntity | null>;
}
