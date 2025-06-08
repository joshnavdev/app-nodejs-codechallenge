import { TransactionTypeEnum } from 'src/transaction/domain/entities/transactionType.entity';
import TransactionTypeRepository from '../../../domain/repositories/transactionType.repository';
import { InjectRepository } from '@nestjs/typeorm';
import TransactionTypeOrmEntity from '../entitties/transactionTypeOrm.entity';
import { Repository } from 'typeorm';

export default class TransactionTypeRepositoryImpl implements TransactionTypeRepository {
  constructor(
    @InjectRepository(TransactionTypeOrmEntity)
    private readonly repository: Repository<TransactionTypeOrmEntity>,
  ) {}

  findOneByName(name: string) {
    return this.repository.findOneBy({ name: name as TransactionTypeEnum });
  }
}
