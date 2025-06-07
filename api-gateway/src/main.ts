import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AsyncOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.connectMicroservice<AsyncOptions<MicroserviceOptions>>({
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
            clientId: kafkaConfig.client.consumerId,
            brokers: kafkaConfig.brokers,
          },
          consumer: {
            groupId: kafkaConfig.groupId,
          },
        },
      };
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
