import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ConfigModule, DatabaseModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
