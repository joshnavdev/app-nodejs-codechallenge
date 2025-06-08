import { IsInt, IsNumber, IsUUID, Max } from 'class-validator';
import CreateTransaction from '../../domain/dtos/createTransaction';

export default class CreateTransactionDto implements CreateTransaction {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsInt()
  transferTypeId: number;

  @IsNumber()
  @Max(99999999.99) // To make float (10,2)
  value: number;
}
