import TransactionEntity from '../../domain/entities/transaction.entity';
import TransactionService from '../../domain/services/transaction.service';
import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_EVENT } from '../../commons/tokens';
import CreateTransaction from '../../domain/dtos/createTransaction';
import TransactionEvent from '../../domain/events/transaction.event';

@Injectable()
export default class TransactionServiceImpl implements TransactionService {
  constructor(
    @Inject(TRANSACTION_EVENT)
    private readonly transactionEvent: TransactionEvent,
  ) {}

  create(createTransactionDto: CreateTransaction): Promise<TransactionEntity> {
    return this.transactionEvent.emitTransactionCreate(createTransactionDto);
  }

  findById(id: string): Promise<TransactionEntity> {
    return this.transactionEvent.emitTransactionGetById(id);
  }
}
