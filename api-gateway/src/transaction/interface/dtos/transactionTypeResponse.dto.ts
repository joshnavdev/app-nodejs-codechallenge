import TransactionTypeEntity from '../../domain/entities/transactionType.entity';
import { Exclude } from 'class-transformer';

export default class TransactionTypeResponseDto extends TransactionTypeEntity {
  @Exclude()
  declare id: number;
}
