import TransactionStatusService from '../../domain/services/transactionStatus.service';
import { Inject } from '@nestjs/common';
import { TRANSACTION_STATUS_REPOSITORY } from '../../commons/tokens';
import TransactionStatusRepository from '../../domain/repositories/transactionStatus.repository';
import TransactionStatusEntity from 'src/transaction/domain/entities/transactionStatus.entity';
import RpcBusinessException from '../../interface/exceptions/RpcBusinessException';

export default class TransactionStatusServiceImpl implements TransactionStatusService {
  constructor(
    @Inject(TRANSACTION_STATUS_REPOSITORY)
    private readonly transactionStatusRepo: TransactionStatusRepository,
  ) {}

  async findOneByName(name: string): Promise<TransactionStatusEntity> {
    const transactionStatus = await this.transactionStatusRepo.findOneByName(name);

    if (!transactionStatus) {
      throw new RpcBusinessException('Transfer type not found', 404);
    }

    return transactionStatus;
  }
}
