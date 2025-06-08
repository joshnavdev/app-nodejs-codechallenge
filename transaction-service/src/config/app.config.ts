export enum EnvironmentEnum {
  DEV = 'development',
  PROD = 'production',
}

export interface AppConfig {
  env: EnvironmentEnum;
}

export default (): { app: AppConfig } => ({
  app: {
    env: (process.env.NODE_ENV as EnvironmentEnum) || EnvironmentEnum.DEV,
  },
});
