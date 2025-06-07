import TransactionStatusService from '../../domain/services/transactionStatus.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { TRANSACTION_STATUS_REPOSITORY } from '../../commons/tokens';
import TransactionStatusRepository from '../../domain/repositories/transactionStatus.repository';
import TransactionStatusEntity from 'src/transaction/domain/entities/transactionStatus.entity';

export default class TransactionStatusServiceImpl implements TransactionStatusService {
  constructor(
    @Inject(TRANSACTION_STATUS_REPOSITORY)
    private readonly transactionStatusRepo: TransactionStatusRepository,
  ) {}

  async findOneByName(name: string): Promise<TransactionStatusEntity> {
    const transactionStatus = await this.transactionStatusRepo.findOneByName(name);

    if (!transactionStatus) {
      throw new NotFoundException('Transaction Status not found');
    }

    return transactionStatus;
  }
}
