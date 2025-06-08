import TransactionTypeRepositoryImpl from './transactionType.repository.impl';
import { Repository } from 'typeorm';
import TransactionTypeOrmEntity from '../entitties/transactionTypeOrm.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionTypeEnum } from '../../../domain/entities/transactionType.entity';

describe('TransactionTypeRepositoryImpl', () => {
  let repository: TransactionTypeRepositoryImpl;
  let ormRepo: jest.Mocked<Repository<TransactionTypeOrmEntity>>;

  beforeEach(async () => {
    const mockOrmRepo = {
      findOneBy: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransactionTypeRepositoryImpl,
        {
          provide: getRepositoryToken(TransactionTypeOrmEntity),
          useValue: mockOrmRepo,
        },
      ],
    }).compile();

    repository = module.get(TransactionTypeRepositoryImpl);
    ormRepo = module.get(getRepositoryToken(TransactionTypeOrmEntity));
  });

  it('should find a transaction type by name', async () => {
    const transactionTypeName = TransactionTypeEnum.TRANSFER;
    const transactionTypeOrm = new TransactionTypeOrmEntity();
    transactionTypeOrm.id = 1;
    transactionTypeOrm.name = transactionTypeName;

    ormRepo.findOneBy.mockResolvedValue(transactionTypeOrm);

    const result = await repository.findOneByName(transactionTypeName);

    expect(ormRepo.findOneBy).toHaveBeenCalledWith({ name: transactionTypeName });
    expect(result).toEqual(transactionTypeOrm);
  });
});
