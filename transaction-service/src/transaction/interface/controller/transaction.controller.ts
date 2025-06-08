import { Controller, Inject, Logger, UseFilters, ValidationPipe } from '@nestjs/common';
import CreateTransactionDto from '../dtos/createTransaction.dto';
import { TRANSACTION_SERVICE } from '../../commons/tokens';
import TransactionService from '../../domain/services/transaction.service';
import TransactionEntity from '../../domain/entities/transaction.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Serialize } from '../decorators/serialize.decorator';
import { RpcExceptionFilter } from '../filters/rpcException.filter';
import {
  APPROVE_TRANSACTION_TOPIC,
  REJECT_TRANSACTION_TOPIC,
  TRANSACTION_CREATE_TOPIC,
  TRANSACTION_GET_BY_ID_TOPIC,
} from '../../commons/constants';

@Controller()
@UseFilters(RpcExceptionFilter)
export default class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {}

  @MessagePattern(TRANSACTION_CREATE_TOPIC)
  @Serialize(TransactionEntity)
  createTransaction(@Payload(ValidationPipe) createTransactionDto: CreateTransactionDto) {
    this.logger.log('ON EVENT: transaction_create');
    return this.transactionService.create(createTransactionDto);
  }

  @MessagePattern(APPROVE_TRANSACTION_TOPIC)
  async approveTransaction({ transactionId }: { transactionId: string }) {
    this.logger.log('Transaction approval event received');
    await this.transactionService.approveTransaction(transactionId);
  }

  @MessagePattern(REJECT_TRANSACTION_TOPIC)
  async rejectTransaction({ transactionId }: { transactionId: string }) {
    this.logger.log('Transaction rejection event received');
    await this.transactionService.rejectTransaction(transactionId);
  }

  @MessagePattern(TRANSACTION_GET_BY_ID_TOPIC)
  @Serialize(TransactionEntity)
  getTransaction(@Payload() id: string) {
    this.logger.log('ON EVENT: transaction_get_by_id');
    return this.transactionService.findById(id);
  }
}
