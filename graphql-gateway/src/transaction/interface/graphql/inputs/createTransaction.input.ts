import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { CustomUuidScalar } from '../scalars/customUuid.scalar';
import CreateTransaction from '../../../domain/dtos/createTransaction';

@InputType()
export default class CreateTransactionInput implements CreateTransaction {
  @Field(() => CustomUuidScalar)
  accountExternalIdDebit: string;

  @Field(() => CustomUuidScalar)
  accountExternalIdCredit: string;

  @Field(() => Int)
  transferTypeId: number;

  @Field(() => Float)
  value: number;
}
