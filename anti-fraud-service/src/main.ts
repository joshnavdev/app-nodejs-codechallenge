import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AsyncOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<
    AsyncOptions<MicroserviceOptions>
  >(AppModule, {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const kafkaConfig = configService.get<KafkaConfig>('kafka');
      return {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: kafkaConfig?.client.consumerId as string,
            brokers: kafkaConfig?.brokers as string[],
          },
          consumer: {
            groupId: kafkaConfig?.groupId as string,
          },
        },
      };
    },
  });

  await app.listen();
}

bootstrap();
