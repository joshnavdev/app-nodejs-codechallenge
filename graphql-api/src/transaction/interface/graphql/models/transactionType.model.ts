import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
