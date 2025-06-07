import TransactionStatusEntity from '../entities/transactionStatus.entity';

export default interface TransactionStatusRepository {
  findOneByName(name: string): Promise<TransactionStatusEntity | null>;
}
