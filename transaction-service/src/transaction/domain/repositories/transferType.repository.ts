import TransferTypeEntity from '../entities/transferType.entity';

export default interface TransferTypeRepository {
  findById(id: number): Promise<TransferTypeEntity | null>;
}
