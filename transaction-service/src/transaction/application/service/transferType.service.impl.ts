import { Inject } from '@nestjs/common';
import TransferTypeEntity from '../../domain/entities/transferType.entity';
import TransferTypeService from '../../domain/services/transferType.service';
import { TRANSFER_TYPE_REPOSITORY } from '../../commons/tokens';
import TransferTypeRepository from '../../domain/repositories/transferType.repository';
import RpcBusinessException from '../../interface/exceptions/RpcBusinessException';

export default class TransferTypeServiceImpl implements TransferTypeService {
  constructor(
    @Inject(TRANSFER_TYPE_REPOSITORY)
    private readonly transferTypeRepo: TransferTypeRepository,
  ) {}

  async findById(id: number): Promise<TransferTypeEntity> {
    const transferType = await this.transferTypeRepo.findById(id);

    if (!transferType) {
      throw new RpcBusinessException('Transfer type not found', 404);
    }

    return transferType;
  }
}
