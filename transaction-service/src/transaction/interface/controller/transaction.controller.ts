import { Controller, Inject, Logger, UseFilters, ValidationPipe } from '@nestjs/common';
import CreateTransactionDto from '../dtos/createTransaction.dto';
import { TRANSACTION_SERVICE } from '../../commons/tokens';
import TransactionService from '../../domain/services/transaction.service';
import TransactionEntity from '../../domain/entities/transaction.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Serialize } from '../decorators/serialize.decorator';
import { RpcExceptionFilter } from '../filters/rpcException.filter';

@Controller()
@UseFilters(RpcExceptionFilter)
export default class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {}

  @MessagePattern('transaction_create')
  @Serialize(TransactionEntity)
  createTransaction(@Payload(ValidationPipe) createTransactionDto: CreateTransactionDto) {
    this.logger.log('ON EVENT: transaction_create');
    return this.transactionService.create(createTransactionDto);
  }

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

  @MessagePattern('transaction_get_by_id')
  @Serialize(TransactionEntity)
  getTransaction(@Payload() id: string) {
    this.logger.log('ON EVENT: transaction_get_by_id');
    return this.transactionService.findById(id);
  }
}
