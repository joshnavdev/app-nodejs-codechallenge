import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TransactionModule } from './transaction/interface/transaction.module';

@Module({
  imports: [ConfigModule, TransactionModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
