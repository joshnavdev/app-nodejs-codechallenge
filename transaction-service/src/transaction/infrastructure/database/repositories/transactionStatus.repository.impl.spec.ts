import { Repository } from 'typeorm';
import TransactionStatusRepositoryImpl from './transactionStatus.repository.impl';
import TransactionStatusOrmEntity from '../entitties/transactionStatusOrm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { TransactionStatusEnum } from '../../../domain/entities/transactionStatus.entity';

describe('TransactionStatusRepositoryImpl', () => {
  let repository: TransactionStatusRepositoryImpl;
  let ormRepo: jest.Mocked<Repository<TransactionStatusOrmEntity>>;

  beforeEach(async () => {
    const mockOrmRepo = {
      findOneBy: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransactionStatusRepositoryImpl,
        {
          provide: getRepositoryToken(TransactionStatusOrmEntity),
          useValue: mockOrmRepo,
        },
      ],
    }).compile();

    repository = module.get(TransactionStatusRepositoryImpl);
    ormRepo = module.get(getRepositoryToken(TransactionStatusOrmEntity));
  });

  it('should find a transaction status by name', async () => {
    const transactionStatusName = TransactionStatusEnum.PENDING;
    const transactionStatusOrm = new TransactionStatusOrmEntity();
    transactionStatusOrm.id = 1;
    transactionStatusOrm.name = transactionStatusName;

    ormRepo.findOneBy.mockResolvedValue(transactionStatusOrm);

    const result = await repository.findOneByName(transactionStatusName);

    expect(ormRepo.findOneBy).toHaveBeenCalledWith({ name: transactionStatusName });
    expect(result).toEqual(transactionStatusOrm);
  });
});
