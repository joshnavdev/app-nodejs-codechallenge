import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class TransferType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
