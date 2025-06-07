import * as joi from 'joi';
import { EnvironmentEnum } from './app.config';

export const configValidationSchema = joi.object({
  NODE_ENV: joi.string().default(EnvironmentEnum.DEV),
  DB_HOST: joi.string(),
  DB_PORT: joi.number().default(3000),
  DB_USER: joi.string().required(),
  DB_PASS: joi.string().required(),
  DB_NAME: joi.string().required(),
});
