import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidationSchema } from './validation';
import appConfig from './app.config';
import kafkaConfig from './kafka.config';
import databaseConfig from './database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      load: [appConfig, databaseConfig, kafkaConfig],
    }),
  ],
})
export class ConfigModule {}
