import { HealthController } from './health.controller';
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { RedisIndicator } from '../../application/indicators/redis.indicator';
import { KafkaIndicator } from '../../application/indicators/kafka.indicator';
import { Test } from '@nestjs/testing';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn(),
    };

    const mockRedisIndicator = {
      isHealthy: jest.fn(),
    };

    const mockKafkaIndicator = {
      isHealthy: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: RedisIndicator, useValue: mockRedisIndicator },
        { provide: KafkaIndicator, useValue: mockKafkaIndicator },
      ],
    }).compile();

    controller = module.get(HealthController);
    healthCheckService = module.get(HealthCheckService);
  });

  describe('liveness', () => {
    it('should return liveness check', async () => {
      const mockResult = { status: 'ok' } as HealthCheckResult;
      healthCheckService.check.mockResolvedValueOnce(mockResult);

      const result = await controller.liveness();

      expect(healthCheckService.check).toHaveBeenCalledWith([]);
      expect(result).toBe(mockResult);
    });

    it('should throw an error if liveness check fails', async () => {
      const err = new Error('boom');
      healthCheckService.check.mockRejectedValue(err);

      await expect(controller.liveness()).rejects.toThrow('boom');
      expect(healthCheckService.check).toHaveBeenCalledWith([]);
    });
  });

  describe('readiness', () => {
    it('should return readiness check', async () => {
      const mockResult = { status: 'ok' } as HealthCheckResult;
      healthCheckService.check.mockResolvedValueOnce(mockResult);

      const result = await controller.readiness();

      expect(healthCheckService.check).toHaveBeenCalledWith([expect.any(Function), expect.any(Function)]);
      expect(result).toBe(mockResult);
    });
  });
});
