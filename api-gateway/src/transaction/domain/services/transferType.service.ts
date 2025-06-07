import TransferTypeEntity from '../entities/transferType.entity';

export default interface TransferTypeService {
  findById(id: number): Promise<TransferTypeEntity>;
}
