import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ConfigModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
