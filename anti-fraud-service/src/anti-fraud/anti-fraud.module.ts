import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../config/kafka.config';
import { ANTI_FRAUD_EVENT_PRODUCER } from './constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ANTI_FRAUD_EVENT_PRODUCER,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const kafkaConfig = configService.get<KafkaConfig>('kafka');

          if (!kafkaConfig) {
            throw new Error('Kafka config not defined');
          }

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: kafkaConfig.client.producerId,
                brokers: kafkaConfig.brokers,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
