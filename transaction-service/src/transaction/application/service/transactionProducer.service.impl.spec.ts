import { ClientKafka } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import TransactionProducerServiceImpl from './transactionProducer.service.impl';
import { TRANSACTION_MICROSERVICE_PRODUCER } from '../../commons/tokens';
import CreateTransaction from '../../domain/dtos/createTransaction';
import { createMockTransactionEntity } from '../../../../test/factories/transactionEntity.factory';
import { of } from 'rxjs';
import { TRANSACTION_CREATE_TOPIC, TRANSACTION_CREATED_TOPIC } from '../../commons/constants';

describe('TransactionProducerServiceImpl', () => {
  let service: TransactionProducerServiceImpl;
  let client: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    const mockClient = {
      send: jest.fn(),
      emit: jest.fn(),
      subscribeToResponseOf: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransactionProducerServiceImpl,
        {
          provide: TRANSACTION_MICROSERVICE_PRODUCER,
          useValue: mockClient,
        },
      ],
    }).compile();

    service = module.get(TransactionProducerServiceImpl);
    client = module.get(TRANSACTION_MICROSERVICE_PRODUCER);
  });

  describe('emitTransactionCreate', () => {
    it('should emit transaction_created event with data', async () => {
      const createTransactionDto: CreateTransaction = {
        accountExternalIdDebit: 'accounting-external-id-debit',
        accountExternalIdCredit: 'accounting-external-id-credit',
        transferTypeId: 1,
        value: 99.99,
      };

      const transaction = createMockTransactionEntity();

      client.send.mockReturnValue(of(transaction));
      const result = await service.emitTransactionCreate(createTransactionDto);

      expect(client.send).toHaveBeenCalledWith(TRANSACTION_CREATE_TOPIC, createTransactionDto);
      expect(result).toEqual(transaction);
    });
  });

  describe('emitTransactionValidation', () => {
    it('should emit transaction_created event with data', () => {
      const transaction = createMockTransactionEntity();

      service.emitTransactionValidation(transaction);

      expect(client.emit).toHaveBeenCalledWith(TRANSACTION_CREATED_TOPIC, {
        id: transaction.id,
        amount: transaction.amount,
      });
    });
  });

  describe('onModuleInit', () => {
    it('should subscribe to transaction_created topic', () => {
      service.onModuleInit();
      expect(client.subscribeToResponseOf).toHaveBeenCalledWith(TRANSACTION_CREATED_TOPIC);
    });
  });
});
