import { TransactionStatusEnum } from 'src/transaction/domain/entities/transactionStatus.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatusRepository } from '../../../domain/repositories/transactionStatus.repository';
import { TransactionStatusOrmEntity } from '../entities/transactionStatusOrm.entity';

export class TransactionStatusRepositoryImpl implements TransactionStatusRepository {
  constructor(
    @InjectRepository(TransactionStatusOrmEntity)
    private readonly repository: Repository<TransactionStatusOrmEntity>,
  ) {}

  findOneByName(name: string) {
    return this.repository.findOneBy({ name: name as TransactionStatusEnum });
  }
}
