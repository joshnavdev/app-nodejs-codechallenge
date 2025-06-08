import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import TransactionResolver from './interface/graphql/resolvers/transaction.resolve';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../config/kafka.config';
import { GRAPHQL_TRANSACTION_PRODUCER, TRANSACTION_EVENT, TRANSACTION_SERVICE } from './commons/tokens';
import TransactionServiceImpl from './application/service/transaction.service.impl';
import TransactionEventImpl from './infrastructure/events/transaction.event.impl';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
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
                groupId: 'graphql-transaction-service-group',
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [
    TransactionResolver,
    { provide: TRANSACTION_SERVICE, useClass: TransactionServiceImpl },
    { provide: TRANSACTION_EVENT, useClass: TransactionEventImpl },
  ],
})
export class TransactionModule {}
