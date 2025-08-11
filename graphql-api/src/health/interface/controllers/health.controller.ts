import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RedisIndicator } from '../../application/indicators/redis.indicator';
import { KafkaIndicator } from '../../application/indicators/kafka.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private redisIndicator: RedisIndicator,
    private kafkaIndicator: KafkaIndicator,
  ) {}

  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([() => this.redisIndicator.isHealthy(), () => this.kafkaIndicator.isHealthy()]);
  }
}
