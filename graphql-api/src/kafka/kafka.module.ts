import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../config/kafka.config';
import { GRAPHQL_TRANSACTION_PRODUCER } from './tokens';

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
  exports: [ClientsModule],
})
export class KafkaModule {}
