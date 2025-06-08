import AntiFraudService from './anti-fraud.service';
import TransactionDto from './dtos/transaction.dto';
import AntiFraudController from './anti-fraud.controller';
import { Test } from '@nestjs/testing';

describe('AntiFraudController', () => {
  let controller: AntiFraudController;
  let mockAntiFraudService: jest.Mocked<AntiFraudService>;

  beforeEach(async () => {
    mockAntiFraudService = {
      validateTransaction: jest.fn(),
      emitTransactionStatusUpdate: jest.fn(),
    } as unknown as jest.Mocked<AntiFraudService>;
    const module = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [{ provide: AntiFraudService, useValue: mockAntiFraudService }],
    }).compile();
    controller = module.get<AntiFraudController>(AntiFraudController);
  });

  describe('transactionCreated', () => {
    it('should validate transaction and emit status update', () => {
      const transaction: TransactionDto = new TransactionDto('trx-id-01', 1200);

      mockAntiFraudService.validateTransaction.mockReturnValue(true);

      controller.transactionCreated(transaction);
      expect(mockAntiFraudService.validateTransaction).toHaveBeenCalledWith(transaction);
      expect(mockAntiFraudService.emitTransactionStatusUpdate).toHaveBeenCalledWith(transaction.id, true);
    });
  });
});
