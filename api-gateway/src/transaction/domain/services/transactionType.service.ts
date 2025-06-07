import TransactionTypeEntity from '../entities/transactionType.entity';

export default interface TransactionTypeService {
  findOneByName(name: string): Promise<TransactionTypeEntity>;
}
