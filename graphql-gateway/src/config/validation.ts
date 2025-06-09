import * as joi from 'joi';
import { EnvironmentEnum } from './app.config';

export const configValidationSchema = joi.object({
  NODE_ENV: joi.string().default(EnvironmentEnum.DEV),
  KAFKA_BROKER_0: joi.string().required(),
  KAFKA_CLIENT_ID_CONSUMER: joi.string().required(),
  KAFKA_CLIENT_ID_PRODUCER: joi.string().required(),
  KAFKA_GROUP_ID: joi.string().required(),
  CACHE_URL: joi.string().required(),
  CACHE_TTL: joi.number().default(3600),
});
