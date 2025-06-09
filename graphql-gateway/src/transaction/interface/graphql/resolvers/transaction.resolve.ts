import { Resolver, Query, Args, Mutation, Directive } from '@nestjs/graphql';
import Transaction from '../models/transaction.model';
import { CustomUuidScalar } from '../scalars/customUuid.scalar';
import { Inject, UseFilters } from '@nestjs/common';
import { TRANSACTION_SERVICE } from '../../../commons/tokens';
import TransactionService from '../../../domain/services/transaction.service';
import { Serialize } from '../../decorators/serialize.decorator';
import TransactionResponseDto from '../../dtos/transactionResponse.dto';
import CreateTransactionInput from '../inputs/createTransaction.input';
import CatchExceptionFilter from '../../filters/catchException.filter';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Resolver(() => Transaction)
@UseFilters(CatchExceptionFilter)
export default class TransactionResolver {
  constructor(
    @Inject(TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Query(() => Transaction)
  @Serialize(TransactionResponseDto)
  async getTransaction(@Args('id', { type: () => CustomUuidScalar }) id: string) {
    try {
      return this.transactionService.findById(id);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  @Mutation(() => Transaction)
  @Serialize(TransactionResponseDto)
  createTransaction(@Args('createTransactionData') createTransactionData: CreateTransactionInput) {
    return this.transactionService.create(createTransactionData);
  }
}
