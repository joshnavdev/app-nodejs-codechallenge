import { TransactionStatusService } from '../../domain/services/transactionStatus.service';
import { TransactionStatusRepository } from '../../domain/repositories/transactionStatus.repository';
import { Test } from '@nestjs/testing';
import { TransactionStatusServiceImpl } from './transactionStatus.service.impl';
import { TRANSACTION_STATUS_REPOSITORY } from '../../domain/constants';
import { TransactionStatusEntity, TransactionStatusEnum } from '../../domain/entities/transactionStatus.entity';
import { NotFoundError } from '../../domain/errors/notFound.error';

describe('TransactionStatusServiceImpl', () => {
  let service: TransactionStatusService;
  let transactionStatusRepo: jest.Mocked<TransactionStatusRepository>;

  beforeEach(async () => {
    const mockRepo = {
      findOneByName: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [TransactionStatusServiceImpl, { provide: TRANSACTION_STATUS_REPOSITORY, useValue: mockRepo }],
    }).compile();

    service = module.get(TransactionStatusServiceImpl);
    transactionStatusRepo = module.get(TRANSACTION_STATUS_REPOSITORY);
  });

  it('should find a transaction status by name', async () => {
    const transactionStatusName = TransactionStatusEnum.PENDING;
    const transactionStatus = new TransactionStatusEntity(1, transactionStatusName);

    transactionStatusRepo.findOneByName.mockResolvedValue(transactionStatus);
    const result = await service.findOneByName(transactionStatusName);

    expect(transactionStatusRepo.findOneByName).toHaveBeenCalledWith(transactionStatusName);
    expect(result).toEqual(transactionStatus);
  });

  it('should throw an error if transaction status not found', async () => {
    const transactionStatusName = 'NON_EXISTENT_STATUS';
    transactionStatusRepo.findOneByName.mockResolvedValue(null);

    await expect(service.findOneByName(transactionStatusName)).rejects.toThrow(NotFoundError);
    await expect(service.findOneByName(transactionStatusName)).rejects.toThrow('Transaction Status not found');
    expect(transactionStatusRepo.findOneByName).toHaveBeenCalledWith(transactionStatusName);
  });
});
