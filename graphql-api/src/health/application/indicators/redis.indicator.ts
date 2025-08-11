import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BaseIndicator } from '../../domain/indicators/base.indicator';

export class RedisIndicator implements BaseIndicator<HealthIndicatorResult> {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async isHealthy() {
    const indicator = this.healthIndicatorService.check<string>('redis');
    const healthyKey = 'redis:healthy';

    try {
      await this.cacheManager.set(healthyKey, 'ok');
      const value = await this.cacheManager.get(healthyKey);
      if (value === 'ok') {
        return indicator.up();
      } else {
        return indicator.down({ message: 'Unexpected value from Redis' });
      }
    } catch (error) {
      return indicator.down({
        message: 'Redis is not reachable',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
