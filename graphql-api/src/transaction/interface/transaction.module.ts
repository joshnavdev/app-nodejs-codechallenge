import { Module } from '@nestjs/common';
import { TransactionResolver } from './graphql/resolvers/transaction.resolver';
import {
  GRAPHQL_TRANSACTION_PRODUCER,
  TRANSACTION_EVENT,
  TRANSACTION_REPOSITORY,
  TRANSACTION_SERVICE,
} from '../domain/constants';
import { TransactionServiceImpl } from '../application/services/transaction.service.impl';
import { TransactionRepositoryImpl } from '../infrastructure/repositories/transaction.repository.impl';
import { TransactionEventImpl } from '../infrastructure/events/transaction.event.impl';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../../config/kafka.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GRAPHQL_TRANSACTION_PRODUCER,
        useFactory(configService: ConfigService) {
          const kafkaConfig = configService.get<KafkaConfig>('kafka');

          if (!kafkaConfig) {
            throw new Error('Kafka configuration is not defined');
          }

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: kafkaConfig.client.producerId,
                brokers: kafkaConfig.brokers,
              },
              consumer: {
                groupId: kafkaConfig.groupId,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
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
