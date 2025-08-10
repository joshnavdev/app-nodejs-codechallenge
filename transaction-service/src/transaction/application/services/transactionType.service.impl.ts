import { Inject, Injectable } from '@nestjs/common';
import { TransactionTypeService } from '../../domain/services/transactionType.service';
import { TRANSACTION_TYPE_REPOSITORY } from '../../domain/constants';
import { TransactionTypeRepository } from '../../domain/repositories/transactionType.repository';
import { TransactionTypeEntity } from '../../domain/entities/transactionType.entity';
import { BadRequestError } from '../../domain/errors/badRequest.error';

@Injectable()
export class TransactionTypeServiceImpl implements TransactionTypeService {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepo: TransactionTypeRepository,
  ) {}

  async findOneByName(name: string): Promise<TransactionTypeEntity> {
    const transactionType = await this.transactionTypeRepo.findOneByName(name);

    if (!transactionType) {
      throw new BadRequestError('TransactionType not found');
    }

    return transactionType;
  }
}
