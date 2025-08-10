import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';

@Module({
  imports: [AntiFraudModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
