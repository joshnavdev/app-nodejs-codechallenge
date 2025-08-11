import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TransactionEvent } from '../../domain/events/transaction.event';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransaction } from '../../domain/dtos/createTransaction';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TRANSACTION_CREATE_EVENT, TRANSACTION_GET_BY_ID_EVENT } from '../../domain/constants';
import { firstValueFrom } from 'rxjs';
import { InjectKafka } from '../../../kafka/inject.decorator';

@Injectable()
export class TransactionEventImpl implements TransactionEvent, OnModuleInit {
  private readonly logger = new Logger(TransactionEventImpl.name);

  constructor(@InjectKafka() private readonly client: ClientKafka) {}

  emitTransactionCreate(transaction: CreateTransaction): Promise<TransactionEntity> {
    this.logger.log(`EMIT EVENT: ${TRANSACTION_CREATE_EVENT}`);
    return firstValueFrom(this.client.send<TransactionEntity>(TRANSACTION_CREATE_EVENT, JSON.stringify(transaction)));
  }

  emitTransactionGetById(id: string): Promise<TransactionEntity> {
    this.logger.log(`EMIT EVENT: ${TRANSACTION_GET_BY_ID_EVENT} with ID: ${id}`);
    return firstValueFrom(this.client.send<TransactionEntity>(TRANSACTION_GET_BY_ID_EVENT, id));
  }

  onModuleInit() {
    this.client.subscribeToResponseOf(TRANSACTION_CREATE_EVENT);
    this.client.subscribeToResponseOf(TRANSACTION_GET_BY_ID_EVENT);
  }
}
