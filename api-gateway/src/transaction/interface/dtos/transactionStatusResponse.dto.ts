import { Exclude } from 'class-transformer';
import TransactionStatusEntity from '../../domain/entities/transactionStatus.entity';

export default class TransactionStatusResponseDto extends TransactionStatusEntity {
  @Exclude()
  declare id: number;
}
