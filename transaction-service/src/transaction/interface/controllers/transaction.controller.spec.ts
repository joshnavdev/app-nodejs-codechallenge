import { TransactionController } from './transaction.controller';
import { TransactionService } from '../../domain/services/transaction.service';
import { Test } from '@nestjs/testing';
import { TRANSACTION_SERVICE } from '../../domain/constants';
import { createMockTransactionEntity } from '../../../../test/factories/transactionEntity.factory';
import { createMockCreateTransactionDto } from '../../../../test/factories/transactionDto.factory';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      approveTransaction: jest.fn(),
      rejectTransaction: jest.fn(),
      findById: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TRANSACTION_SERVICE, useValue: mockService }],
    }).compile();

    controller = module.get(TransactionController);
    transactionService = module.get(TRANSACTION_SERVICE);
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const createTransactionDto = createMockCreateTransactionDto();
      const transaction = createMockTransactionEntity();

      transactionService.create.mockResolvedValue(transaction);

      const result = await controller.createTransaction(createTransactionDto);

      expect(transactionService.create).toHaveBeenCalledWith(createTransactionDto);
      expect(result).toEqual(transaction);
    });
  });

  describe('approveTransaction', () => {
    it('should call service.approveTransaction', async () => {
      await controller.approveTransaction({ transactionId: 'transaction-id' });
      expect(transactionService.approveTransaction).toHaveBeenCalledWith('transaction-id');
    });
  });

  describe('rejectTransaction', () => {
    it('should call service.rejectTransaction', async () => {
      await controller.rejectTransaction({ transactionId: 'transaction-id' });
      expect(transactionService.rejectTransaction).toHaveBeenCalledWith('transaction-id');
    });
  });

  describe('getTransaction', () => {
    it('should return a transaction by id', async () => {
      const transactionId = 'transaction-id';
      const transaction = createMockTransactionEntity();
      transaction.id = transactionId;

      transactionService.findById.mockResolvedValue(transaction);

      const result = await controller.getTransaction(transactionId);

      expect(transactionService.findById).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(transaction);
    });
  });
});
