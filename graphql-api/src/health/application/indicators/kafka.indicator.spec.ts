import { KafkaIndicator } from './kafka.indicator';
import { HealthIndicatorService } from '@nestjs/terminus';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { GRAPHQL_TRANSACTION_PRODUCER } from '../../../kafka/tokens';
import { Producer } from 'kafkajs';

describe('KafkaIndicator', () => {
  let indicator: KafkaIndicator;
  let healthIndicatorService: jest.Mocked<HealthIndicatorService>;
  let clientKafka: jest.Mocked<ClientKafka>;
  let mockUp: jest.Mock;
  let mockDown: jest.Mock;

  beforeEach(async () => {
    const mockClientKafka = {
      connect: jest.fn(),
    };

    mockUp = jest.fn();
    mockDown = jest.fn();

    const mockHealthIndicatorService = {
      check: jest.fn().mockReturnValue({
        up: mockUp,
        down: mockDown,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaIndicator,
        {
          provide: GRAPHQL_TRANSACTION_PRODUCER,
          useValue: mockClientKafka,
        },
        {
          provide: HealthIndicatorService,
          useValue: mockHealthIndicatorService,
        },
      ],
    }).compile();

    indicator = module.get(KafkaIndicator);
    clientKafka = module.get(GRAPHQL_TRANSACTION_PRODUCER);
    healthIndicatorService = module.get(HealthIndicatorService);
  });

  it('return UP status when Kafka connects successfully', async () => {
    const mockResult = { status: 'up' };
    clientKafka.connect.mockResolvedValue({} as Producer);
    mockUp.mockResolvedValue(mockResult);

    const result = await indicator.isHealthy();

    expect(healthIndicatorService.check).toHaveBeenCalledWith('kafka');
    expect(clientKafka.connect).toHaveBeenCalledTimes(1);
    expect(mockUp).toHaveBeenCalledTimes(1);
    expect(mockDown).not.toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('return DOWN status when kafka connection fails', async () => {
    const mockError = new Error('Kafka connection failed');
    clientKafka.connect.mockRejectedValue(mockError);
    const mockResult = { status: 'down', message: 'Kafka is not reachable', error: mockError.message };
    mockDown.mockResolvedValue(mockResult);

    const result = await indicator.isHealthy();

    expect(healthIndicatorService.check).toHaveBeenCalledWith('kafka');
    expect(clientKafka.connect).toHaveBeenCalledTimes(1);
    expect(mockUp).not.toHaveBeenCalled();
    expect(mockDown).toHaveBeenCalledWith({
      message: 'Kafka is not reachable',
      error: mockError.message,
    });
    expect(result).toEqual(mockResult);
  });
});
