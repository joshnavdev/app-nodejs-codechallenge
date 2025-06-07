import { Module } from '@nestjs/common';
import AntiFraudController from './anti-fraud.controller';
import AntiFraudService from './anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ANTI_FRAUD_EVENT_PRODUCER } from './tokens';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../config/kafka.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ANTI_FRAUD_EVENT_PRODUCER,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const kafkaConfig = configService.get<KafkaConfig>('kafka');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: kafkaConfig?.client.producerId,
                brokers: kafkaConfig?.brokers as string[],
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
