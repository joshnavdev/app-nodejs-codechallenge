import TransactionEntity from '../../domain/entities/transaction.entity';
import TransactionService from '../../domain/services/transaction.service';
import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_EVENT, TRANSACTION_REPOSITORY } from '../../commons/tokens';
import CreateTransaction from '../../domain/dtos/createTransaction';
import TransactionEvent from '../../domain/events/transaction.event';
import TransactionRepository from '../../domain/repositories/transaction.repository';

@Injectable()
export default class TransactionServiceImpl implements TransactionService {
  constructor(
    @Inject(TRANSACTION_EVENT)
    private readonly transactionEvent: TransactionEvent,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  create(createTransactionDto: CreateTransaction): Promise<TransactionEntity> {
    return this.transactionEvent.emitTransactionCreate(createTransactionDto);
  }

  async findById(id: string): Promise<TransactionEntity> {
    let transaction = await this.transactionRepository.findByid(id);

    if (!transaction) {
      transaction = await this.transactionEvent.emitTransactionGetById(id);
      await this.transactionRepository.create(transaction);
    }

    return transaction;
  }
}
