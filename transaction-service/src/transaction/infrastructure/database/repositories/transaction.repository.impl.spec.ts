import TransactionRepositoryImpl from './transaction.repository.impl';
import { Repository } from 'typeorm';
import TransactionOrmEntity from '../entitties/transactionOrm.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockTransactionOrmEntity } from '../../../../../test/factories/transactionOrmEntity.factory';
import { createMockTransactionEntity } from '../../../../../test/factories/transactionEntity.factory';

describe('TransactionRepositoryImpl', () => {
  let repository: TransactionRepositoryImpl;
  let ormRepo: jest.Mocked<Repository<TransactionOrmEntity>>;

  beforeEach(async () => {
    const mockOrmRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        TransactionRepositoryImpl,
        {
          provide: getRepositoryToken(TransactionOrmEntity),
          useValue: mockOrmRepo,
        },
      ],
    }).compile();

    repository = module.get(TransactionRepositoryImpl);
    ormRepo = module.get(getRepositoryToken(TransactionOrmEntity));
  });

  it('should save a transaction', async () => {
    const transaction = createMockTransactionEntity();
    const transactionOrm = createMockTransactionOrmEntity();

    ormRepo.create.mockReturnValue(transactionOrm);
    ormRepo.save.mockResolvedValue(transactionOrm);
    const result = await repository.save(transaction);

    expect(ormRepo.create).toHaveBeenCalledWith(transaction);
    expect(ormRepo.save).toHaveBeenCalledWith(transactionOrm);
    expect(result).toEqual(transactionOrm);
  });

  it('should find a transaction by id', async () => {
    const trxId = 'transaction-id';
    const transactionOrm = createMockTransactionOrmEntity();
    transactionOrm.id = trxId;

    ormRepo.findOne.mockResolvedValue(transactionOrm);

    const result = await repository.findById(trxId);

    expect(ormRepo.findOne).toHaveBeenCalledWith({
      where: { id: trxId },
      relations: {
        transactionStatus: true,
        transactionType: true,
        transferType: true,
      },
    });

    expect(result).toEqual(transactionOrm);
  });
});
