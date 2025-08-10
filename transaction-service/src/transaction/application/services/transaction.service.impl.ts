import { Inject, Injectable } from '@nestjs/common';
import { TransactionStatusEnum } from '../../domain/entities/transactionStatus.entity';
import {
  TRANSACTION_PRODUCER_SERVICE,
  TRANSACTION_REPOSITORY,
  TRANSACTION_STATUS_SERVICE,
  TRANSACTION_TYPE_SERVICE,
} from '../../domain/constants';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionTypeService } from '../../domain/services/transactionType.service';
import { TransactionStatusService } from '../../domain/services/transactionStatus.service';
import { TransactionProducerService } from '../../domain/services/transactionProducer.service';
import { CreateTransaction } from '../../domain/dtos/createTransaction';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionService } from '../../domain/services/transaction.service';
import { TransactionTypeEnum } from '../../domain/entities/transactionType.entity';
import { NotFoundError } from '../../domain/errors/notFound.error';
import { BadRequestError } from '../../domain/errors/badRequest.error';

@Injectable()
export class TransactionServiceImpl implements TransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: TransactionRepository,
    @Inject(TRANSACTION_TYPE_SERVICE)
    private readonly transactionTypeService: TransactionTypeService,
    @Inject(TRANSACTION_STATUS_SERVICE)
    private readonly transactionStatusService: TransactionStatusService,
    @Inject(TRANSACTION_PRODUCER_SERVICE)
    private readonly transactionProducerService: TransactionProducerService,
  ) {}

  async create(createTransactionDto: CreateTransaction): Promise<TransactionEntity> {
    const transactionType = await this.transactionTypeService.findOneByName(TransactionTypeEnum.TRANSFER);
    const transactionStatus = await this.transactionStatusService.findOneByName(TransactionStatusEnum.PENDING);

    const transaction = new TransactionEntity(
      createTransactionDto.accountExternalIdDebit,
      createTransactionDto.accountExternalIdCredit,
      transactionType,
      transactionStatus,
      createTransactionDto.value,
      new Date(),
    );

    const savedTransaction = await this.transactionRepo.save(transaction);

    this.transactionProducerService.emitTransactionValidation(savedTransaction);

    return savedTransaction;
  }

  async findById(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepo.findById(id);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  async approveTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.findById(id);

    if (transaction.transactionStatus.name !== TransactionStatusEnum.PENDING) {
      throw new BadRequestError('Transaction is not in a pending state');
    }

    transaction.transactionStatus = await this.transactionStatusService.findOneByName(TransactionStatusEnum.APPROVED);

    return this.transactionRepo.save(transaction);
  }

  async rejectTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.findById(id);

    if (transaction.transactionStatus.name !== TransactionStatusEnum.PENDING) {
      throw new BadRequestError('Transaction is not in a pending state');
    }

    transaction.transactionStatus = await this.transactionStatusService.findOneByName(TransactionStatusEnum.REJECTED);

    return this.transactionRepo.save(transaction);
  }
}
