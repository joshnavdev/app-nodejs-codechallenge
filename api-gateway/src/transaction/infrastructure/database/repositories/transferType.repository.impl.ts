import TransferTypeRepository from '../../../domain/repositories/transferType.repository';
import { InjectRepository } from '@nestjs/typeorm';
import TransferTypeOrmEntity from '../entitties/transferTypeOrm.entity';
import { Repository } from 'typeorm';

export default class TransferTypeRepositoryImpl implements TransferTypeRepository {
  constructor(
    @InjectRepository(TransferTypeOrmEntity)
    private readonly repository: Repository<TransferTypeOrmEntity>,
  ) {}

  findById(id: number) {
    return this.repository.findOneBy({ id });
  }
}
