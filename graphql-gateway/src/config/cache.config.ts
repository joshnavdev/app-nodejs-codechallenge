export interface CacheConfig {
  url: string;
  ttl: number;
}

export default (): { cache: CacheConfig } => ({
  cache: {
    url: process.env.CACHE_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.CACHE_TTL as string, 10) || 1800, // Default to 1 hour
  },
});
