import { Transaction } from '../models/transaction.model';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CustomUuidScalar } from '../scalars/customUuid.scalar';
import { TransactionService } from '../../../domain/services/transaction.service';
import { TRANSACTION_SERVICE } from '../../../domain/constants';
import { Inject, UseFilters } from '@nestjs/common';
import { CreateTransactionInput } from '../inputs/createTransaction.input';
import { CatchExceptionFilter } from '../../filters/catchException.filter';
import { Serialize } from '../../decorators/serialize.decorator';
import { TransactionResponseDto } from '../../dtos/transactionResponse.dto';

@Resolver(() => Transaction)
@UseFilters(CatchExceptionFilter)
export class TransactionResolver {
  constructor(@Inject(TRANSACTION_SERVICE) private readonly transactionService: TransactionService) {}

  @Query(() => Transaction)
  @Serialize(TransactionResponseDto)
  async getTransaction(@Args('id', { type: () => CustomUuidScalar }) id: string) {
    return this.transactionService.findById(id);
  }

  @Mutation(() => Transaction)
  @Serialize(TransactionResponseDto)
  createTransaction(@Args('createTransactionData') createTransactionData: CreateTransactionInput) {
    return this.transactionService.create(createTransactionData);
  }
}
