import { TransactionService } from '../../domain/services/transaction.service';
import { CreateTransaction } from '../../domain/dtos/createTransaction';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionEvent } from '../../domain/events/transaction.event';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TRANSACTION_EVENT, TRANSACTION_REPOSITORY } from '../../domain/constants';
import { Inject } from '@nestjs/common';

export class TransactionServiceImpl implements TransactionService {
  constructor(
    @Inject(TRANSACTION_EVENT) private readonly transactionEvent: TransactionEvent,
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: TransactionRepository,
  ) {}

  create(transactionDto: CreateTransaction): Promise<TransactionEntity> {
    return this.transactionEvent.emitTransactionCreate(transactionDto);
  }

  async findById(id: string): Promise<TransactionEntity> {
    let transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      transaction = await this.transactionEvent.emitTransactionGetById(id);
      await this.transactionRepository.create(transaction);
    }

    return transaction;
  }
}
