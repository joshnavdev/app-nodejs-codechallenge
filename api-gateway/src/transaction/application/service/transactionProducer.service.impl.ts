import TransactionProducerService from '../../domain/services/transactionProducer.service';
import { TRANSACTION_MICROSERVICE_PRODUCER } from '../../commons/tokens';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ValidateTransaction } from '../../domain/dtos/validateTransaction';
import TransactionEntity from '../../domain/entities/transaction.entity';

@Injectable()
export default class TransactionProducerServiceImpl implements TransactionProducerService {
  private readonly logger = new Logger(TransactionProducerServiceImpl.name);

  constructor(
    @Inject(TRANSACTION_MICROSERVICE_PRODUCER)
    private readonly antiFraudClient: ClientKafka,
  ) {}

  emitTransactionValidation(transaction: TransactionEntity): void {
    this.logger.log(`Emitting transaction validation for transaction ID: ${transaction.id}`);

    const transactionData: ValidateTransaction = {
      id: transaction.id,
      amount: transaction.amount,
    };

    this.antiFraudClient.emit('transaction_created', transactionData);
  }
}
