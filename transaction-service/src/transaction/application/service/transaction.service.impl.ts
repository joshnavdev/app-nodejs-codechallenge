import TransactionEntity from '../../domain/entities/transaction.entity';
import TransactionService from '../../domain/services/transaction.service';
import TransactionRepository from '../../domain/repositories/transaction.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TRANSACTION_REPOSITORY,
  TRANSACTION_STATUS_SERVICE,
  TRANSACTION_TYPE_SERVICE,
  TRANSFER_TYPE_SERVICE,
} from '../../commons/tokens';
import TransferTypeService from '../../domain/services/transferType.service';
import TransactionTypeService from '../../domain/services/transactionType.service';
import TransactionStatusService from '../../domain/services/transactionStatus.service';
import { TransactionTypeEnum } from '../../domain/entities/transactionType.entity';
import { TransactionStatusEnum } from '../../domain/entities/transactionStatus.entity';
import CreateTransaction from '../../domain/dtos/createTransaction';

@Injectable()
export default class TransactionServiceImpl implements TransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: TransactionRepository,
    @Inject(TRANSFER_TYPE_SERVICE)
    private readonly transferTypeService: TransferTypeService,
    @Inject(TRANSACTION_TYPE_SERVICE)
    private readonly transactionTypeService: TransactionTypeService,
    @Inject(TRANSACTION_STATUS_SERVICE)
    private readonly transactionStatusService: TransactionStatusService,
  ) {}

  async create(createTransactionDto: CreateTransaction) {
    const transferType = await this.transferTypeService.findById(createTransactionDto.transferTypeId);
    const transactionType = await this.transactionTypeService.findOneByName(TransactionTypeEnum.TRANSFER);
    const transactionStatus = await this.transactionStatusService.findOneByName(TransactionStatusEnum.PENDING);

    const transaction = new TransactionEntity(
      createTransactionDto.accountExternalIdDebit,
      createTransactionDto.accountExternalIdCredit,
      transferType,
      transactionType,
      transactionStatus,
      createTransactionDto.value,
      new Date(),
    );

    return this.transactionRepo.save(transaction);
  }

  async findById(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepo.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
