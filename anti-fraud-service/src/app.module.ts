import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, AntiFraudModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
