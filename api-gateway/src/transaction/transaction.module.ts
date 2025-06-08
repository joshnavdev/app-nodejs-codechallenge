import { Module } from '@nestjs/common';
import TransactionController from './interface/controller/transaction.controller';
import { TRANSACTION_MICROSERVICE_PRODUCER, TRANSACTION_EVENT, TRANSACTION_SERVICE } from './commons/tokens';
import TransactionServiceImpl from './application/service/transaction.service.impl';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import TransactionEventImpl from './infrastructure/events/transaction.event.impl';
import { KafkaConfig } from '../config/kafka.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: TRANSACTION_MICROSERVICE_PRODUCER,
        useFactory: (configService: ConfigService) => {
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
                groupId: 'transaction-service-group',
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    { provide: TRANSACTION_SERVICE, useClass: TransactionServiceImpl },
    { provide: TRANSACTION_EVENT, useClass: TransactionEventImpl },
  ],
})
export class TransactionModule {}
