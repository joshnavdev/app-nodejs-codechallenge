import { Inject, Injectable } from '@nestjs/common';
import { TransactionStatusService } from '../../domain/services/transactionStatus.service';
import { TRANSACTION_STATUS_REPOSITORY } from '../../domain/constants';
import { TransactionStatusRepository } from '../../domain/repositories/transactionStatus.repository';
import { TransactionStatusEntity } from '../../domain/entities/transactionStatus.entity';
import { NotFoundError } from '../../domain/errors/notFound.error';

@Injectable()
export class TransactionStatusServiceImpl implements TransactionStatusService {
  constructor(
    @Inject(TRANSACTION_STATUS_REPOSITORY)
    private readonly transactionStatusRepo: TransactionStatusRepository,
  ) {}

  async findOneByName(name: string): Promise<TransactionStatusEntity> {
    const transactionStatus = await this.transactionStatusRepo.findOneByName(name);

    if (!transactionStatus) {
      throw new NotFoundError('Transaction Status not found');
    }

    return transactionStatus;
  }
}
