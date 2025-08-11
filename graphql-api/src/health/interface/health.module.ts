import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { CacheModule } from '../../cache/cache.module';
import { RedisIndicator } from '../application/indicators/redis.indicator';
import { KafkaModule } from '../../kafka/kafka.module';
import { KafkaIndicator } from '../application/indicators/kafka.indicator';

@Module({
  imports: [KafkaModule, CacheModule, TerminusModule],
  controllers: [HealthController],
  providers: [KafkaIndicator, RedisIndicator],
})
export class HealthModule {}
