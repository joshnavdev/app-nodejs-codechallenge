import { Controller, Inject, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import TransactionDto from './dtos/transaction.dto';
import AntiFraudService from './anti-fraud.service';

@Controller()
export default class AntiFraudController {
  private readonly logger = new Logger(AntiFraudController.name);

  constructor(@Inject() public readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('transaction_created')
  transactionCreated(@Payload() transaction: TransactionDto) {
    this.logger.log('Transaction created event received');
    const isFraudulent = this.antiFraudService.validateTransaction(transaction);

    this.logger.log('Transaction validation completed');

    this.antiFraudService.emitTransactionStatusUpdate(transaction.id, isFraudulent);
  }
}
