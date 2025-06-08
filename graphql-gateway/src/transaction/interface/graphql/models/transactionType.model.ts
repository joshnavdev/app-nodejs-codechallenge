import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class TransactionType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
