import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../../domain/repositories/transaction.repository';
import { TransactionOrmEntity } from '../entities/transactionOrm.entity';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: TransactionEntity) {
    const entity = this.repository.create(transaction);
    return this.repository.save(entity);
  }

  findById(id: string): Promise<TransactionEntity | null> {
    return this.repository.findOne({
      where: { id: id },
      relations: {
        transactionStatus: true,
        transactionType: true,
      },
    });
  }
}
