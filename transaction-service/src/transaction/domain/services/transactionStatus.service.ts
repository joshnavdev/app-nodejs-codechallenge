import TransactionStatusEntity from '../entities/transactionStatus.entity';

export default interface TransactionStatusService {
  findOneByName(name: string): Promise<TransactionStatusEntity>;
}
