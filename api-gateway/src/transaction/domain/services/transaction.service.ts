import TransactionEntity from '../entities/transaction.entity';
import CreateTransaction from '../dtos/createTransaction';

export default interface TransactionService {
  create(transactionDto: CreateTransaction): Promise<TransactionEntity>;
  findById(id: string): Promise<TransactionEntity>;
  approveTransaction(id: string): Promise<TransactionEntity>;
  rejectTransaction(id: string): Promise<TransactionEntity>;
}
