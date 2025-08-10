import * as joi from 'joi';

export const configValidationSchema = joi.object({
  NODE_ENV: joi.string().default('development'),
  KAFKA_BROKER_0: joi.string().required(),
  KAFKA_CLIENT_ID_CONSUMER: joi.string().required(),
  KAFKA_CLIENT_ID_PRODUCER: joi.string().required(),
  KAFKA_GROUP_ID: joi.string().required(),
});
