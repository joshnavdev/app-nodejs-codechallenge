import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { CacheConfig } from '../config/cache.config';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<CacheConfig>('cache');

        if (!redisConfig) {
          throw new Error('Cache configuration is not defined');
        }

        return {
          stores: [createKeyv(redisConfig.url)],
          ttl: redisConfig.ttl,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
})
export class CacheModule {}
