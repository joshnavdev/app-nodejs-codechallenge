import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TransferTypeEnum } from '../../../domain/entities/transferType.entity';

@Entity('transfer_types')
export default class TransferTypeOrmEntity {
  @PrimaryColumn({ name: 'transfer_type_id' })
  id: number;

  @Column({ name: 'name', unique: true })
  name: TransferTypeEnum;
}
