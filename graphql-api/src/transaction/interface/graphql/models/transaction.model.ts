import { Field, Float, ObjectType } from '@nestjs/graphql';
import { CustomUuidScalar } from '../scalars/customUuid.scalar';
import { TransactionType } from './transactionType.model';
import { TransactionStatus } from './transactionStatus.model';

@ObjectType({ description: 'Transaction schema' })
export class Transaction {
  @Field(() => CustomUuidScalar)
  transactionExternalId: string;

  @Field(() => Float)
  value: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => TransactionType)
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;
}
