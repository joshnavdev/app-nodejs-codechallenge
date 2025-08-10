import { TransactionStatusEntity } from '../entities/transactionStatus.entity';

export interface TransactionStatusRepository {
  findOneByName(name: string): Promise<TransactionStatusEntity | null>;
}
