import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { RedisIndicator } from './redis.indicator';
import { HealthIndicatorService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';

describe('RedisIndicator', () => {
  let indicator: RedisIndicator;
  let healthIndicatorService: jest.Mocked<HealthIndicatorService>;
  let cacheManager: jest.Mocked<Cache>;
  let mockUp: jest.Mock;
  let mockDown: jest.Mock;

  beforeEach(async () => {
    mockUp = jest.fn();
    mockDown = jest.fn();

    const mockHealthIndicatorService = {
      check: jest.fn().mockReturnValueOnce({
        up: mockUp,
        down: mockDown,
      }),
    };

    const mockCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        RedisIndicator,
        {
          provide: HealthIndicatorService,
          useValue: mockHealthIndicatorService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    indicator = module.get(RedisIndicator);
    healthIndicatorService = module.get(HealthIndicatorService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should return UP status when Redis is healthy', async () => {
    const mockResult = { status: 'up' };
    mockUp.mockResolvedValue(mockResult);

    cacheManager.set.mockResolvedValue(undefined);
    cacheManager.get.mockResolvedValue('ok');

    const result = await indicator.isHealthy();

    expect(healthIndicatorService.check).toHaveBeenCalledWith('redis');
    expect(cacheManager.set).toHaveBeenCalledWith('redis:healthy', 'ok');
    expect(cacheManager.get).toHaveBeenCalledWith('redis:healthy');
    expect(mockUp).toHaveBeenCalledTimes(1);
    expect(mockDown).not.toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('should return DOWN status when Redis is not reachable', async () => {
    const mockError = new Error('Redis connection failed');
    const mockResult = { status: 'down', message: 'Redis is not reachable', error: mockError.message };
    mockDown.mockResolvedValue(mockResult);

    cacheManager.set.mockRejectedValue(mockError);

    const result = await indicator.isHealthy();

    expect(healthIndicatorService.check).toHaveBeenCalledWith('redis');
    expect(cacheManager.set).toHaveBeenCalledWith('redis:healthy', 'ok');
    expect(mockDown).toHaveBeenCalledTimes(1);
    expect(mockUp).not.toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });
});
