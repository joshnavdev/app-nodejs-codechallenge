import TransactionEntity from 'src/transaction/domain/entities/transaction.entity';
import TransactionRepository from '../../domain/repositories/transaction.repository';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

export default class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  create(transaction: TransactionEntity): Promise<TransactionEntity> {
    return this.cacheManager.set<TransactionEntity>(transaction.id, transaction);
  }

  findByid(id: string): Promise<TransactionEntity | undefined> {
    return this.cacheManager.get<TransactionEntity>(id);
  }
}
