import { TransactionService } from '../../domain/services/transaction.service';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionTypeService } from '../../domain/services/transactionType.service';
import { TransactionStatusService } from '../../domain/services/transactionStatus.service';
import { TransactionProducerService } from '../../domain/services/transactionProducer.service';
import { Test } from '@nestjs/testing';
import { TransactionServiceImpl } from './transaction.service.impl';
import {
  TRANSACTION_PRODUCER_SERVICE,
  TRANSACTION_REPOSITORY,
  TRANSACTION_STATUS_SERVICE,
  TRANSACTION_TYPE_SERVICE,
} from '../../domain/constants';
import { TransactionTypeEntity, TransactionTypeEnum } from '../../domain/entities/transactionType.entity';
import { TransactionStatusEntity, TransactionStatusEnum } from '../../domain/entities/transactionStatus.entity';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { createMockTransactionEntity } from '../../../../test/factories/transactionEntity.factory';
import { createMockCreateTransactionDto } from '../../../../test/factories/transactionDto.factory';
import { NotFoundError } from '../../domain/errors/notFound.error';
import { BadRequestError } from '../../domain/errors/badRequest.error';

describe('TransactionServiceImpl', () => {
  let service: TransactionService;
  let transactionRepo: jest.Mocked<TransactionRepository>;
  let transactionTypeService: jest.Mocked<TransactionTypeService>;
  let transactionStatusService: jest.Mocked<TransactionStatusService>;
  let transactionProducerService: jest.Mocked<TransactionProducerService>;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const mockTransactionRepo = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    const mockTransactionTypeService = {
      findOneByName: jest.fn(),
    };

    const mockTransactionStatusService = {
      findOneByName: jest.fn(),
    };

    const mockTransactionProducerService = {
      emitTransactionValidation: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransactionServiceImpl,
        { provide: TRANSACTION_REPOSITORY, useValue: mockTransactionRepo },
        { provide: TRANSACTION_TYPE_SERVICE, useValue: mockTransactionTypeService },
        { provide: TRANSACTION_STATUS_SERVICE, useValue: mockTransactionStatusService },
        { provide: TRANSACTION_PRODUCER_SERVICE, useValue: mockTransactionProducerService },
      ],
    }).compile();

    service = module.get(TransactionServiceImpl);
    transactionRepo = module.get(TRANSACTION_REPOSITORY);
    transactionTypeService = module.get(TRANSACTION_TYPE_SERVICE);
    transactionStatusService = module.get(TRANSACTION_STATUS_SERVICE);
    transactionProducerService = module.get(TRANSACTION_PRODUCER_SERVICE);
  });

  it('should create a transaction and emit validation event', async () => {
    const createTransactionDto = createMockCreateTransactionDto();

    const transactionType = new TransactionTypeEntity(1, TransactionTypeEnum.TRANSFER);
    const transactionStatus = new TransactionStatusEntity(1, TransactionStatusEnum.PENDING);

    const transaction = new TransactionEntity(
      createTransactionDto.accountExternalIdDebit,
      createTransactionDto.accountExternalIdCredit,
      transactionType,
      transactionStatus,
      createTransactionDto.value,
      new Date(),
    );

    transactionTypeService.findOneByName.mockResolvedValue(transactionType);
    transactionStatusService.findOneByName.mockResolvedValue(transactionStatus);
    transactionRepo.save.mockResolvedValue(transaction);

    const result = await service.create(createTransactionDto);

    expect(transactionTypeService.findOneByName).toHaveBeenCalledWith(TransactionTypeEnum.TRANSFER);
    expect(transactionStatusService.findOneByName).toHaveBeenCalledWith(TransactionStatusEnum.PENDING);
    expect(transactionRepo.save).toHaveBeenCalledWith(transaction);
    expect(transactionProducerService.emitTransactionValidation).toHaveBeenCalledWith(transaction);
    expect(result).toEqual(transaction);
  });

  it('should find a transaction by id', async () => {
    const transaction = createMockTransactionEntity();
    transactionRepo.findById.mockResolvedValue(transaction);

    const result = await service.findById(transaction.id);

    expect(transactionRepo.findById).toHaveBeenCalledWith(transaction.id);
    expect(result).toEqual(transaction);
  });

  it('should throw an error if transaction not found', async () => {
    const transactionId = 'NON_EXISTENT_ID';
    transactionRepo.findById.mockResolvedValue(null);

    await expect(service.findById(transactionId)).rejects.toThrow(NotFoundError);
    await expect(service.findById(transactionId)).rejects.toThrow('Transaction not found');
    expect(transactionRepo.findById).toHaveBeenCalledWith(transactionId);
  });

  it('should approve a transaction', async () => {
    const transaction = createMockTransactionEntity();
    transaction.transactionStatus = new TransactionStatusEntity(1, TransactionStatusEnum.PENDING);
    const approvedStatus = new TransactionStatusEntity(2, TransactionStatusEnum.APPROVED);

    transactionRepo.findById.mockResolvedValue(transaction);
    transactionStatusService.findOneByName.mockResolvedValue(approvedStatus);
    transactionRepo.save.mockResolvedValue({ ...transaction, transactionStatus: approvedStatus });

    const result = await service.approveTransaction(transaction.id);

    expect(transactionRepo.findById).toHaveBeenCalledWith(transaction.id);
    expect(transactionStatusService.findOneByName).toHaveBeenCalledWith(TransactionStatusEnum.APPROVED);
    expect(transactionRepo.save).toHaveBeenCalledWith({ ...transaction, transactionStatus: approvedStatus });
    expect(result.transactionStatus.name).toBe(TransactionStatusEnum.APPROVED);
  });

  it('should throw an error when approving a non-pending transaction', async () => {
    const transaction = createMockTransactionEntity();
    transaction.transactionStatus = new TransactionStatusEntity(1, TransactionStatusEnum.APPROVED);

    transactionRepo.findById.mockResolvedValue(transaction);

    await expect(service.approveTransaction(transaction.id)).rejects.toThrow(BadRequestError);
    await expect(service.approveTransaction(transaction.id)).rejects.toThrow('Transaction is not in a pending state');
    expect(transactionRepo.findById).toHaveBeenCalledWith(transaction.id);
  });

  it('should reject a transaction', async () => {
    const transaction = createMockTransactionEntity();
    transaction.transactionStatus = new TransactionStatusEntity(1, TransactionStatusEnum.PENDING);
    const rejectedStatus = new TransactionStatusEntity(2, TransactionStatusEnum.REJECTED);

    transactionRepo.findById.mockResolvedValue(transaction);
    transactionStatusService.findOneByName.mockResolvedValue(rejectedStatus);
    transactionRepo.save.mockResolvedValue({ ...transaction, transactionStatus: rejectedStatus });

    const result = await service.rejectTransaction(transaction.id);

    expect(transactionRepo.findById).toHaveBeenCalledWith(transaction.id);
    expect(transactionStatusService.findOneByName).toHaveBeenCalledWith(TransactionStatusEnum.REJECTED);
    expect(transactionRepo.save).toHaveBeenCalledWith({ ...transaction, transactionStatus: rejectedStatus });
    expect(result.transactionStatus.name).toBe(TransactionStatusEnum.REJECTED);
  });

  it('should throw an error when rejecting a non-pending transaction', async () => {
    const transaction = createMockTransactionEntity();
    transaction.transactionStatus = new TransactionStatusEntity(1, TransactionStatusEnum.APPROVED);

    transactionRepo.findById.mockResolvedValue(transaction);

    await expect(service.rejectTransaction(transaction.id)).rejects.toThrow(BadRequestError);
    await expect(service.rejectTransaction(transaction.id)).rejects.toThrow('Transaction is not in a pending state');
    expect(transactionRepo.findById).toHaveBeenCalledWith(transaction.id);
  });
});
