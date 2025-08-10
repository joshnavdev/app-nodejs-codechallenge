import { TransactionTypeEntity } from '../entities/transactionType.entity';

export interface TransactionTypeRepository {
  findOneByName(name: string): Promise<TransactionTypeEntity | null>;
}
