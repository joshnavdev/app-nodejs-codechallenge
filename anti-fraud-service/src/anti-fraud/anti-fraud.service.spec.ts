import AntiFraudService from './anti-fraud.service';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ANTI_FRAUD_EVENT_PRODUCER } from './tokens';
import TransactionDto from './dtos/transaction.dto';
import { APPROVE_TRANSACTION_TOPIC, REJECT_TRANSACTION_TOPIC, TRANSACTION_AMOUNT_THRESHOLD } from './constants';

describe('AntiFraudService', () => {
  let service: AntiFraudService;
  let mockClientProducer: ClientKafka;

  beforeEach(async () => {
    mockClientProducer = {
      emit: jest.fn(),
    } as unknown as ClientKafka;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: ANTI_FRAUD_EVENT_PRODUCER,
          useValue: mockClientProducer,
        },
      ],
    }).compile();

    service = module.get<AntiFraudService>(AntiFraudService);
  });

  describe('validateTransaction', () => {
    it('should return true for transactions above the threshold', () => {
      const dto: TransactionDto = { id: 'test', amount: TRANSACTION_AMOUNT_THRESHOLD + 1 };
      expect(service.validateTransaction(dto)).toBe(true);
    });

    it('should return false for transactions below the threshold', () => {
      const dto: TransactionDto = { id: 'test', amount: TRANSACTION_AMOUNT_THRESHOLD - 1 };
      expect(service.validateTransaction(dto)).toBe(false);
    });
  });

  describe('emitTransactionStatusUpdate', () => {
    it('should emit reject transaction event for fraudulent transactions', () => {
      const trxId = 'fraudulent-transaction';
      service.emitTransactionStatusUpdate(trxId, true);
      expect(mockClientProducer.emit).toHaveBeenCalledWith(REJECT_TRANSACTION_TOPIC, { transactionId: trxId });
    });

    it('should emit approve transaction event for non-fraudulent transactions', () => {
      const trxId = 'valid-transaction';
      service.emitTransactionStatusUpdate(trxId, false);
      expect(mockClientProducer.emit).toHaveBeenCalledWith(APPROVE_TRANSACTION_TOPIC, { transactionId: trxId });
    });
  });
});
