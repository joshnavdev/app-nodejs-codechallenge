import { Inject, NotFoundException } from '@nestjs/common';
import TransactionTypeService from '../../domain/services/transactionType.service';
import { TRANSACTION_TYPE_REPOSITORY } from '../../commons/tokens';
import TransactionTypeRepository from '../../domain/repositories/transactionType.repository';
import TransactionTypeEntity from 'src/transaction/domain/entities/transactionType.entity';

export default class TransactionTypeServiceImpl implements TransactionTypeService {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepo: TransactionTypeRepository,
  ) {}

  async findOneByName(name: string): Promise<TransactionTypeEntity> {
    const transactionType = await this.transactionTypeRepo.findOneByName(name);

    if (!transactionType) {
      throw new NotFoundException('Transaction Type not found');
    }

    return transactionType;
  }
}
