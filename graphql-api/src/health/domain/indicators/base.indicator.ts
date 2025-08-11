export interface BaseIndicator<R> {
  isHealthy(): Promise<R>;
}
