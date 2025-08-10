import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatus {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
