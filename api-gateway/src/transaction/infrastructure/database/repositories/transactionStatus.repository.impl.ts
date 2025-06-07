import { TransactionStatusEnum } from 'src/transaction/domain/entities/transactionStatus.entity';
import TransactionStatusRepository from '../../../domain/repositories/transactionStatus.repository';
import { Repository } from 'typeorm';
import TransactionStatusOrmEntity from '../entitties/transactionStatusOrm.entity';
import { InjectRepository } from '@nestjs/typeorm';

export default class TransactionStatusRepositoryImpl implements TransactionStatusRepository {
  constructor(
    @InjectRepository(TransactionStatusOrmEntity)
    private readonly repository: Repository<TransactionStatusOrmEntity>,
  ) {}

  findOneByName(name: string) {
    return this.repository.findOneBy({ name: name as TransactionStatusEnum });
  }
}
