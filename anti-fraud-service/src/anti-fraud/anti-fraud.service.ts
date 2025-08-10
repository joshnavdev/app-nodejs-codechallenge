import TransactionDto from './dtos/transaction.dto';
import {
  ANTI_FRAUD_EVENT_PRODUCER,
  APPROVE_TRANSACTION_TOPIC,
  REJECT_TRANSACTION_TOPIC,
  TRANSACTION_AMOUNT_THRESHOLD,
} from './constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  constructor(
    @Inject(ANTI_FRAUD_EVENT_PRODUCER)
    private readonly clientProducer: ClientKafka,
  ) {}

  validateTransaction(transaction: TransactionDto): boolean {
    return transaction.amount > TRANSACTION_AMOUNT_THRESHOLD;
  }

  emitTransactionStatusUpdate(transactionId: string, isFraudulent: boolean) {
    if (isFraudulent) {
      return void this.emitRejectTransaction(transactionId);
    }

    return void this.emitApproveTransaction(transactionId);
  }

  private emitRejectTransaction(transactionId: string) {
    this.logger.log(`EMIT EVENT: ${REJECT_TRANSACTION_TOPIC} for transaction ID: ${transactionId}`);
    this.clientProducer.emit(REJECT_TRANSACTION_TOPIC, { transactionId });
  }

  private emitApproveTransaction(transactionId: string) {
    this.logger.log(`EMIT EVENT: ${APPROVE_TRANSACTION_TOPIC} for transaction ID: ${transactionId}`);
    this.clientProducer.emit(APPROVE_TRANSACTION_TOPIC, { transactionId });
  }
}
