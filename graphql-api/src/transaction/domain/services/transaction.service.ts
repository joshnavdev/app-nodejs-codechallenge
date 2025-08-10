import { TransactionEntity } from '../entities/transaction.entity';
import { CreateTransaction } from '../dtos/createTransaction';

export interface TransactionService {
  create(transactionDto: CreateTransaction): Promise<TransactionEntity>;
  findById(id: string): Promise<TransactionEntity>;
}
