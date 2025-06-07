import { Controller, Inject, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TRANSACTION_SERVICE } from '../../commons/tokens';
import TransactionService from '../../domain/services/transaction.service';

@Controller()
export default class TransactionConsumerController {
  private readonly logger = new Logger(TransactionConsumerController.name);

  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {}

  @MessagePattern('approve_transaction')
  approveTransaction({ transactionId }: { transactionId: string }) {
    this.logger.log('Transaction approval event received');
    return void this.transactionService.approveTransaction(transactionId);
  }

  @MessagePattern('reject_transaction')
  rejectTransaction({ transactionId }: { transactionId: string }) {
    this.logger.log('Transaction rejection event received');
    return void this.transactionService.rejectTransaction(transactionId);
  }
}
