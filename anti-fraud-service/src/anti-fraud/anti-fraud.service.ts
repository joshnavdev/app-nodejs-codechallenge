import TransactionDto from './dtos/transaction.dto';
import { TRANSACTION_AMOUNT_THRESHOLD } from './constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ANTI_FRAUD_EVENT_PRODUCER } from './tokens';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export default class AntiFraudService {
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
    this.logger.log(`Emitting reject transaction event for ID: ${transactionId}`);
    this.clientProducer.emit('reject_transaction', { transactionId });
  }

  private emitApproveTransaction(transactionId: string) {
    this.logger.log(`Emitting approve transaction event for ID: ${transactionId}`);
    this.clientProducer.emit('approve_transaction', { transactionId });
  }
}
