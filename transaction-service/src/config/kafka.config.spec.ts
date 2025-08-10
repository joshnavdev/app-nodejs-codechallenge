import kafkaConfig from './kafka.config';

describe('kafkaConfig for transaction service', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return kafka configuration correctly for transaction service', () => {
    process.env.KAFKA_BROKER_0 = 'localhost:9092';
    process.env.KAFKA_CLIENT_ID_CONSUMER = 'test-consumer';
    process.env.KAFKA_CLIENT_ID_PRODUCER = 'test-producer';
    process.env.KAFKA_GROUP_ID = 'test-group';

    const transactionServiceKafkaConfig = kafkaConfig();
    expect(transactionServiceKafkaConfig).toEqual({
      kafka: {
        brokers: ['localhost:9092'],
        client: {
          consumerId: 'test-consumer',
          producerId: 'test-producer',
        },
        groupId: 'test-group',
      },
    });
  });
});
