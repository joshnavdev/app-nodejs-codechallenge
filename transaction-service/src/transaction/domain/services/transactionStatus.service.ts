import { TransactionStatusEntity } from '../entities/transactionStatus.entity';

export interface TransactionStatusService {
  findOneByName(name: string): Promise<TransactionStatusEntity>;
}
