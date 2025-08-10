import { CreateTransaction } from '../../../domain/dtos/createTransaction';
import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CustomUuidScalar } from '../scalars/customUuid.scalar';

@InputType()
export class CreateTransactionInput implements CreateTransaction {
  @Field(() => CustomUuidScalar)
  accountExternalIdDebit: string;

  @Field(() => CustomUuidScalar)
  accountExternalIdCredit: string;

  @Field(() => Int)
  transferTypeId: number;

  @Field(() => Float)
  value: number;
}
