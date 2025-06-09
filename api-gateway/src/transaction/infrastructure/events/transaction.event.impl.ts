import TransactionEvent from '../../domain/events/transaction.event';
import { TRANSACTION_MICROSERVICE_PRODUCER } from '../../commons/tokens';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import TransactionEntity from '../../domain/entities/transaction.entity';
import CreateTransaction from 'src/transaction/domain/dtos/createTransaction';
import { firstValueFrom } from 'rxjs';

@Injectable()
export default class TransactionEventImpl implements TransactionEvent, OnModuleInit {
  private readonly logger = new Logger(TransactionEventImpl.name);

  constructor(
    @Inject(TRANSACTION_MICROSERVICE_PRODUCER)
    private readonly client: ClientKafka,
  ) {}

  emitTransactionGetById(id: string): Promise<TransactionEntity> {
    this.logger.log(`EMIT EVENT: transaction_get_by_id with ID: ${id}`);
    return firstValueFrom(this.client.send<TransactionEntity>('transaction_get_by_id', id));
  }

  emitTransactionCreate(transaction: CreateTransaction): Promise<TransactionEntity> {
    this.logger.log('EMIT EVENT: transaction_create');
    return firstValueFrom(this.client.send<TransactionEntity>('transaction_create', JSON.stringify(transaction)));
  }

  onModuleInit() {
    this.client.subscribeToResponseOf('transaction_create');
    this.client.subscribeToResponseOf('transaction_get_by_id');
  }
}
