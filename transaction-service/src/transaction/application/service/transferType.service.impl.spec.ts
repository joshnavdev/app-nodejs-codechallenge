import TransferTypeService from '../../domain/services/transferType.service';
import TransferTypeRepository from '../../domain/repositories/transferType.repository';
import { Test } from '@nestjs/testing';
import TransferTypeServiceImpl from './transferType.service.impl';
import { TRANSFER_TYPE_REPOSITORY } from '../../commons/tokens';
import TransferTypeEntity, { TransferTypeEnum } from '../../domain/entities/transferType.entity';
import RpcBusinessException from '../../interface/exceptions/RpcBusinessException';

describe('TransferTypeServiceImpl', () => {
  let service: TransferTypeService;
  let transferTypeRepo: jest.Mocked<TransferTypeRepository>;

  beforeEach(async () => {
    const mockRepo = {
      findById: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [TransferTypeServiceImpl, { provide: TRANSFER_TYPE_REPOSITORY, useValue: mockRepo }],
    }).compile();

    service = module.get(TransferTypeServiceImpl);
    transferTypeRepo = module.get(TRANSFER_TYPE_REPOSITORY);
  });

  it('should find a transfer type by id', async () => {
    const transferTypeId = 1;
    const transferType = new TransferTypeEntity(transferTypeId, TransferTypeEnum.EXTERNAL);

    transferTypeRepo.findById.mockResolvedValue(transferType);

    const result = await service.findById(transferTypeId);

    expect(transferTypeRepo.findById).toHaveBeenCalledWith(transferTypeId);
    expect(result).toEqual(transferType);
  });

  it('should throw an error if transfer type not found', async () => {
    transferTypeRepo.findById.mockResolvedValue(null);

    await expect(service.findById(999)).rejects.toThrow(RpcBusinessException);
    await expect(service.findById(999)).rejects.toThrow('Transfer type not found');
    expect(transferTypeRepo.findById).toHaveBeenCalledWith(999);
  });
});
