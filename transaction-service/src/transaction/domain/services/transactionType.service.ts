import { TransactionTypeEntity } from '../entities/transactionType.entity';

export interface TransactionTypeService {
  findOneByName(name: string): Promise<TransactionTypeEntity>;
}
