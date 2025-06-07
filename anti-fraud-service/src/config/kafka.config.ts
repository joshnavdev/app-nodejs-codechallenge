export interface KafkaConfig {
  brokers: string[];
  client: {
    consumerId: string;
    producerId: string;
  };
  groupId: string;
}

export default (): { kafka: KafkaConfig } => ({
  kafka: {
    brokers: [process.env.KAFKA_BROKER_0!],
    client: {
      consumerId: process.env.KAFKA_CLIENT_ID_CONSUMER!,
      producerId: process.env.KAFKA_CLIENT_ID_PRODUCER!,
    },
    groupId: process.env.KAFKA_GROUP_ID!,
  },
});
