import TransferTypeRepositoryImpl from './transferType.repository.impl';
import { Repository } from 'typeorm';
import TransferTypeOrmEntity from '../entitties/transferTypeOrm.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransferTypeEnum } from '../../../domain/entities/transferType.entity';

describe('TransferTypeRepositoryImpl', () => {
  let repository: TransferTypeRepositoryImpl;
  let ormRepo: jest.Mocked<Repository<TransferTypeOrmEntity>>;

  beforeEach(async () => {
    const mockOrmRepo = {
      findOneBy: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransferTypeRepositoryImpl,
        {
          provide: getRepositoryToken(TransferTypeOrmEntity),
          useValue: mockOrmRepo,
        },
      ],
    }).compile();

    repository = module.get(TransferTypeRepositoryImpl);
    ormRepo = module.get(getRepositoryToken(TransferTypeOrmEntity));
  });

  it('should find a transfer type by id', async () => {
    const transferTypeId = 1;
    const transferTypeOrm = new TransferTypeOrmEntity();
    transferTypeOrm.id = transferTypeId;
    transferTypeOrm.name = TransferTypeEnum.EXTERNAL;

    ormRepo.findOneBy.mockResolvedValue(transferTypeOrm);

    const result = await repository.findById(transferTypeId);

    expect(ormRepo.findOneBy).toHaveBeenCalledWith({ id: transferTypeId });
    expect(result).toEqual(transferTypeOrm);
  });
});
