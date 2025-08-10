import TransactionRepository from '../../domain/repositories/transaction.repository';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  create(transaction: TransactionEntity): Promise<TransactionEntity> {
    return this.cacheManager.set<TransactionEntity>(transaction.id, transaction);
  }

  findById(id: string): Promise<TransactionEntity | undefined> {
    return this.cacheManager.get<TransactionEntity>(id);
  }
}
