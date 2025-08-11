import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import { InjectKafka } from '../../../kafka/inject.decorator';
import { ClientKafka } from '@nestjs/microservices';
import { BaseIndicator } from '../../domain/indicators/base.indicator';

export class KafkaIndicator implements BaseIndicator<HealthIndicatorResult> {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @InjectKafka() private readonly clientKafka: ClientKafka,
  ) {}

  async isHealthy() {
    const indicator = this.healthIndicatorService.check('kafka');
    const timeout = (ms: number) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

    try {
      await Promise.race([this.clientKafka.connect(), timeout(2000)]);

      return indicator.up();
    } catch (error) {
      return indicator.down({
        message: 'Kafka is not reachable',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
