import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TransactionModule } from './transaction/transaction.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule, TransactionModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
