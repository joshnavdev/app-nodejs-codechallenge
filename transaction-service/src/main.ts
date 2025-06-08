import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from './config/kafka.config';
import { AsyncOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncOptions<MicroserviceOptions>>(AppModule, {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const kafkaConfig = configService.get<KafkaConfig>('kafka');

      if (!kafkaConfig) {
        throw new Error('Kafka configuration is not defined');
      }

      return {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: kafkaConfig?.client.consumerId,
            brokers: kafkaConfig?.brokers,
          },
          consumer: {
            groupId: kafkaConfig?.groupId,
          },
        },
      };
    },
  });

  await app.listen();
}
bootstrap();
