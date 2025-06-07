import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, UseFilters } from '@nestjs/common';
import CreateTransactionDto from '../dtos/createTransaction.dto';
import { TRANSACTION_SERVICE } from '../../commons/tokens';
import TransactionService from '../../domain/services/transaction.service';
import { HttpExceptionFilter } from '../filters/httpException.filter';
import CatchExceptionFilter from '../filters/catchException.filter';
import TransactionEntity from '../../domain/entities/transaction.entity';
import { Serialize } from '../decorators/serialize.decorator';
import TransactionResponseDto from '../dtos/transactionResponse.dto';

@Controller('transactions')
@UseFilters(CatchExceptionFilter, HttpExceptionFilter)
export default class TransactionController {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
  ) {}

  @Serialize(TransactionResponseDto)
  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<TransactionEntity> {
    return this.transactionService.create(createTransactionDto);
  }

  @Serialize(TransactionResponseDto)
  @Get(':transactionId')
  getTransaction(@Param('transactionId', ParseUUIDPipe) transactionId: string): Promise<TransactionEntity> {
    return this.transactionService.findById(transactionId);
  }
}
