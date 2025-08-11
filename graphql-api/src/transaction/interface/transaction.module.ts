import { Module } from '@nestjs/common';
import { TransactionResolver } from './graphql/resolvers/transaction.resolver';
import { TRANSACTION_EVENT, TRANSACTION_REPOSITORY, TRANSACTION_SERVICE } from '../domain/constants';
import { TransactionServiceImpl } from '../application/services/transaction.service.impl';
import { TransactionRepositoryImpl } from '../infrastructure/repositories/transaction.repository.impl';
import { TransactionEventImpl } from '../infrastructure/events/transaction.event.impl';
import { KafkaModule } from '../../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [
    TransactionResolver,
    {
      provide: TRANSACTION_SERVICE,
      useClass: TransactionServiceImpl,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepositoryImpl,
    },
    {
      provide: TRANSACTION_EVENT,
      useClass: TransactionEventImpl,
    },
  ],
})
export class TransactionModule {}
