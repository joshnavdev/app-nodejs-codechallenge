import TransactionProducerService from '../../domain/services/transactionProducer.service';
import { TRANSACTION_MICROSERVICE_PRODUCER } from '../../commons/tokens';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ValidateTransaction } from '../../domain/dtos/validateTransaction';
import TransactionEntity from '../../domain/entities/transaction.entity';
import CreateTransaction from 'src/transaction/domain/dtos/createTransaction';
import { firstValueFrom } from 'rxjs';
import { TRANSACTION_CREATE_TOPIC, TRANSACTION_CREATED_TOPIC } from '../../commons/constants';

@Injectable()
export default class TransactionProducerServiceImpl implements TransactionProducerService, OnModuleInit {
  private readonly logger = new Logger(TransactionProducerServiceImpl.name);

  constructor(
    @Inject(TRANSACTION_MICROSERVICE_PRODUCER)
    private readonly client: ClientKafka,
  ) {}

  emitTransactionCreate(transaction: CreateTransaction): Promise<TransactionEntity> {
    this.logger.log('EMIT EVENT: transaction_create');
    return firstValueFrom(this.client.send<TransactionEntity>(TRANSACTION_CREATE_TOPIC, transaction));
  }

  emitTransactionValidation(transaction: TransactionEntity): void {
    this.logger.log('EMIT EVENT: transaction_created');

    const transactionData: ValidateTransaction = {
      id: transaction.id,
      amount: transaction.amount,
    };

    this.client.emit(TRANSACTION_CREATED_TOPIC, transactionData);
  }

  onModuleInit() {
    this.client.subscribeToResponseOf(TRANSACTION_CREATED_TOPIC);
  }
}
