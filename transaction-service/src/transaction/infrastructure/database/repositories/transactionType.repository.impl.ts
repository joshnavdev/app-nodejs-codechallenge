import { TransactionTypeEnum } from 'src/transaction/domain/entities/transactionType.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionTypeRepository } from '../../../domain/repositories/transactionType.repository';
import { TransactionTypeOrmEntity } from '../entities/transactionTypeOrm.entity';

export class TransactionTypeRepositoryImpl implements TransactionTypeRepository {
  constructor(
    @InjectRepository(TransactionTypeOrmEntity)
    private readonly repository: Repository<TransactionTypeOrmEntity>,
  ) {}

  findOneByName(name: string) {
    return this.repository.findOneBy({ name: name as TransactionTypeEnum });
  }
}
