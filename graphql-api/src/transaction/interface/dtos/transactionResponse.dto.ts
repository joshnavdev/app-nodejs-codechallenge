import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { Exclude, Expose, Type } from 'class-transformer';
import { TransactionStatusResponseDto } from './transactionStatusResponse.dto';
import { TransactionTypeResponseDto } from './transactionTypeResponse.dto';

export class TransactionResponseDto extends TransactionEntity {
  @Exclude({ toPlainOnly: true })
  declare id: string;

  @Exclude({ toPlainOnly: true })
  declare amount: number;

  @Exclude()
  declare accountingExternalIdDebit: string;

  @Exclude()
  declare accountingExternalIdCredit: string;

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
