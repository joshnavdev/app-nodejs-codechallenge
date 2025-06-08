import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class TransactionStatus {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
