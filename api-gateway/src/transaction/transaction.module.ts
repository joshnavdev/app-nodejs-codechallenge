import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TransactionController from './interface/controller/transaction.controller';
import {
  TRANSACTION_MICROSERVICE_PRODUCER,
  TRANSACTION_PRODUCER_SERVICE,
  TRANSACTION_REPOSITORY,
  TRANSACTION_SERVICE,
  TRANSACTION_STATUS_REPOSITORY,
  TRANSACTION_STATUS_SERVICE,
  TRANSACTION_TYPE_REPOSITORY,
  TRANSACTION_TYPE_SERVICE,
  TRANSFER_TYPE_REPOSITORY,
  TRANSFER_TYPE_SERVICE,
} from './commons/tokens';
import TransactionServiceImpl from './application/service/transaction.service.impl';
import TransactionRepositoryImpl from './infrastructure/database/repositories/transaction.repository.impl';
import TransactionOrmEntity from './infrastructure/database/entitties/transactionOrm.entity';
import TransferTypeServiceImpl from './application/service/transferType.service.impl';
import TransactionTypeServiceImpl from './application/service/transactionType.service.impl';
import TransactionStatusServiceImpl from './application/service/transactionStatus.service.impl';
import TransferTypeRepositoryImpl from './infrastructure/database/repositories/transferType.repository.impl';
import TransactionTypeRepositoryImpl from './infrastructure/database/repositories/transactionType.repository.impl';
import TransactionStatusRepositoryImpl from './infrastructure/database/repositories/transactionStatus.repository.impl';
import TransferTypeOrmEntity from './infrastructure/database/entitties/transferTypeOrm.entity';
import TransactionTypeOrmEntity from './infrastructure/database/entitties/transactionTypeOrm.entity';
import TransactionStatusOrmEntity from './infrastructure/database/entitties/transactionStatusOrm.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import TransactionProducerServiceImpl from './application/service/transactionProducer.service.impl';
import { KafkaConfig } from '../config/kafka.config';
import TransactionConsumerController from './interface/controller/transactionConsumer.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionOrmEntity,
      TransferTypeOrmEntity,
      TransactionTypeOrmEntity,
      TransactionStatusOrmEntity,
    ]),
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
            },
          };
        },
      },
    ]),
  ],
  controllers: [TransactionController, TransactionConsumerController],
  providers: [
    { provide: TRANSACTION_SERVICE, useClass: TransactionServiceImpl },
    { provide: TRANSACTION_REPOSITORY, useClass: TransactionRepositoryImpl },
    { provide: TRANSFER_TYPE_SERVICE, useClass: TransferTypeServiceImpl },
    { provide: TRANSFER_TYPE_REPOSITORY, useClass: TransferTypeRepositoryImpl },
    { provide: TRANSACTION_TYPE_SERVICE, useClass: TransactionTypeServiceImpl },
    { provide: TRANSACTION_TYPE_REPOSITORY, useClass: TransactionTypeRepositoryImpl },
    { provide: TRANSACTION_STATUS_SERVICE, useClass: TransactionStatusServiceImpl },
    { provide: TRANSACTION_STATUS_REPOSITORY, useClass: TransactionStatusRepositoryImpl },
    { provide: TRANSACTION_PRODUCER_SERVICE, useClass: TransactionProducerServiceImpl },
  ],
})
export class TransactionModule {}
