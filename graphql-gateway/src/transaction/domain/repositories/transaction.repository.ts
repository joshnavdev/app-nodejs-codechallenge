import TransactionEntity from '../entities/transaction.entity';

export default interface TransactionRepository {
  create(transaction: TransactionEntity): Promise<TransactionEntity>;
  findByid(id: string): Promise<TransactionEntity | undefined>;
}
