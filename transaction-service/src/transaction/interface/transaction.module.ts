import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../../config/kafka.config';
import {
  TRANSACTION_MICROSERVICE_PRODUCER,
  TRANSACTION_PRODUCER_SERVICE,
  TRANSACTION_REPOSITORY,
  TRANSACTION_SERVICE,
  TRANSACTION_STATUS_REPOSITORY,
  TRANSACTION_STATUS_SERVICE,
  TRANSACTION_TYPE_REPOSITORY,
  TRANSACTION_TYPE_SERVICE,
} from '../domain/constants';
import { TransactionServiceImpl } from '../application/services/transaction.service.impl';
import { TransactionTypeServiceImpl } from '../application/services/transactionType.service.impl';
import { TransactionStatusServiceImpl } from '../application/services/transactionStatus.service.impl';
import { TransactionProducerServiceImpl } from '../application/services/transactionProducer.service.impl';
import { TransactionOrmEntity } from '../infrastructure/database/entities/transactionOrm.entity';
import { TransactionTypeOrmEntity } from '../infrastructure/database/entities/transactionTypeOrm.entity';
import { TransactionStatusOrmEntity } from '../infrastructure/database/entities/transactionStatusOrm.entity';
import { TransactionRepositoryImpl } from '../infrastructure/database/repositories/transaction.repository.impl';
import { TransactionTypeRepositoryImpl } from '../infrastructure/database/repositories/transactionType.repository.impl';
import { TransactionStatusRepositoryImpl } from '../infrastructure/database/repositories/transactionStatus.repository.impl';
import { TransactionController } from './controllers/transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity, TransactionTypeOrmEntity, TransactionStatusOrmEntity]),
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_MICROSERVICE_PRODUCER,
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
                clientId: kafkaConfig?.client.producerId,
                brokers: kafkaConfig?.brokers,
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
    { provide: TRANSACTION_REPOSITORY, useClass: TransactionRepositoryImpl },
    { provide: TRANSACTION_TYPE_SERVICE, useClass: TransactionTypeServiceImpl },
    { provide: TRANSACTION_TYPE_REPOSITORY, useClass: TransactionTypeRepositoryImpl },
    { provide: TRANSACTION_STATUS_SERVICE, useClass: TransactionStatusServiceImpl },
    { provide: TRANSACTION_STATUS_REPOSITORY, useClass: TransactionStatusRepositoryImpl },
    { provide: TRANSACTION_PRODUCER_SERVICE, useClass: TransactionProducerServiceImpl },
  ],
})
export class TransactionModule {}
