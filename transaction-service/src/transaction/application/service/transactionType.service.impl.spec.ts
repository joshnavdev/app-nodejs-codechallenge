import TransactionTypeService from '../../domain/services/transactionType.service';
import TransactionTypeRepository from '../../domain/repositories/transactionType.repository';
import { Test } from '@nestjs/testing';
import TransactionTypeServiceImpl from './transactionType.service.impl';
import { TRANSACTION_TYPE_REPOSITORY } from '../../commons/tokens';
import TransactionTypeEntity, { TransactionTypeEnum } from '../../domain/entities/transactionType.entity';
import RpcBusinessException from '../../interface/exceptions/RpcBusinessException';

describe('TransactionTypeServiceImpl', () => {
  let service: TransactionTypeService;
  let transactionTypeRepo: jest.Mocked<TransactionTypeRepository>;

  beforeEach(async () => {
    const mockRepo = {
      findOneByName: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [TransactionTypeServiceImpl, { provide: TRANSACTION_TYPE_REPOSITORY, useValue: mockRepo }],
    }).compile();

    service = module.get(TransactionTypeServiceImpl);
    transactionTypeRepo = module.get(TRANSACTION_TYPE_REPOSITORY);
  });

  it('should find a transaction type by name', async () => {
    const transactionTypeName = TransactionTypeEnum.TRANSFER;
    const transactionType = new TransactionTypeEntity(1, transactionTypeName);

    transactionTypeRepo.findOneByName.mockResolvedValue(transactionType);

    const result = await service.findOneByName(transactionTypeName);

    expect(transactionTypeRepo.findOneByName).toHaveBeenCalledWith(transactionTypeName);
    expect(result).toEqual(transactionType);
  });

  it('should throw an error if transaction type not found', async () => {
    const transactionTypeName = 'NON_EXISTENT_TYPE';
    transactionTypeRepo.findOneByName.mockResolvedValue(null);

    await expect(service.findOneByName(transactionTypeName)).rejects.toThrow(RpcBusinessException);
    await expect(service.findOneByName(transactionTypeName)).rejects.toThrow('Transfer type not found');
    expect(transactionTypeRepo.findOneByName).toHaveBeenCalledWith(transactionTypeName);
  });
});
