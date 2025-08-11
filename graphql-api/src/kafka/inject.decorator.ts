import { Inject } from '@nestjs/common';
import { GRAPHQL_TRANSACTION_PRODUCER } from './tokens';

export const InjectKafka = () => {
  return Inject(GRAPHQL_TRANSACTION_PRODUCER);
};
