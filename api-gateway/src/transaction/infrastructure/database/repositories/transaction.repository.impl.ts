import TransactionRepository from '../../../domain/repositories/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import TransactionOrmEntity from '../entitties/transactionOrm.entity';
import { Repository } from 'typeorm';
import TransactionEntity from '../../../domain/entities/transaction.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repository: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: TransactionEntity) {
    const entity = this.repository.create(transaction);
    const savedEntity = await this.repository.save(entity);

    return savedEntity;
  }

  findById(id: string): Promise<TransactionEntity | null> {
    return this.repository.findOne({
      where: { id: id },
      relations: {
        transactionStatus: true,
        transactionType: true,
        transferType: true,
      },
    });
  }
}
