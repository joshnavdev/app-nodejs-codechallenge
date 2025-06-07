import TransactionTypeEntity from '../entities/transactionType.entity';

export default interface TransactionTypeRepository {
  findOneByName(name: string): Promise<TransactionTypeEntity | null>;
}
