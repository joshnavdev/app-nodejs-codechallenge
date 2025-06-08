import TransactionEntity from '../../domain/entities/transaction.entity';
import TransactionService from '../../domain/services/transaction.service';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_PRODUCER_SERVICE,
  TRANSACTION_REPOSITORY,
  TRANSACTION_STATUS_SERVICE,
  TRANSACTION_TYPE_SERVICE,
  TRANSFER_TYPE_SERVICE,
} from '../../commons/tokens';
import { TransactionStatusEnum } from '../../domain/entities/transactionStatus.entity';
import CreateTransaction from '../../domain/dtos/createTransaction';
import TransactionProducerService from '../../domain/services/transactionProducer.service';
import { RpcException } from '@nestjs/microservices';
import TransactionRepository from '../../domain/repositories/transaction.repository';
import TransferTypeService from '../../domain/services/transferType.service';
import TransactionTypeService from '../../domain/services/transactionType.service';
import TransactionStatusService from '../../domain/services/transactionStatus.service';
import { TransactionTypeEnum } from '../../domain/entities/transactionType.entity';
import RpcBusinessException from '../../interface/exceptions/RpcBusinessException';

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
    @Inject(TRANSACTION_PRODUCER_SERVICE)
    private readonly transactionProducerService: TransactionProducerService,
  ) {}

  async create(createTransactionDto: CreateTransaction): Promise<TransactionEntity> {
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

    const savedTransaction = await this.transactionRepo.save(transaction);

    this.transactionProducerService.emitTransactionValidation(savedTransaction);

    return savedTransaction;
  }

  async findById(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepo.findById(id);

    if (!transaction) {
      throw new RpcBusinessException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    return transaction;
  }

  async approveTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.findById(id);

    if (transaction.transactionStatus.name !== TransactionStatusEnum.PENDING) {
      throw new RpcException('Transaction is not in a pending state');
    }

    transaction.transactionStatus = await this.transactionStatusService.findOneByName(TransactionStatusEnum.APPROVED);

    return this.transactionRepo.save(transaction);
  }

  async rejectTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.findById(id);

    if (transaction.transactionStatus.name !== TransactionStatusEnum.PENDING) {
      throw new RpcException('Transaction is not in a pending state');
    }

    transaction.transactionStatus = await this.transactionStatusService.findOneByName(TransactionStatusEnum.REJECTED);

    return this.transactionRepo.save(transaction);
  }
}
