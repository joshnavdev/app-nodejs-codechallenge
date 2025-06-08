import { Exclude, Expose, Type } from 'class-transformer';
import TransactionEntity from '../../domain/entities/transaction.entity';
import TransferTypeEntity from '../../domain/entities/transferType.entity';
import TransactionTypeResponseDto from './transactionTypeResponse.dto';
import TransactionStatusResponseDto from './transactionStatusResponse.dto';

export default class TransactionResponseDto extends TransactionEntity {
  @Exclude({ toPlainOnly: true })
  declare id: string;

  @Exclude({ toPlainOnly: true })
  declare amount: number;

  @Exclude()
  declare accountingExternalIdDebit: string;

  @Exclude()
  declare accountingExternalIdCredit: string;

  @Expose()
  @Type(() => TransferTypeEntity)
  declare transferType: TransferTypeEntity;

  @Expose()
  @Type(() => TransactionTypeResponseDto)
  declare transactionType: TransactionTypeResponseDto;

  @Expose()
  @Type(() => TransactionStatusResponseDto)
  declare transactionStatus: TransactionStatusResponseDto;

  @Expose()
  get transactionExternalId() {
    return this.id;
  }

  @Expose()
  get value() {
    return this.amount;
  }
}
