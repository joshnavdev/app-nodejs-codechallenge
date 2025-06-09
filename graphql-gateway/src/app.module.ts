import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomUuidScalar } from './transaction/interface/graphql/scalars/customUuid.scalar';
import { ConfigModule } from './config/config.module';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from './config/cache.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
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
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      graphiql: true,
      driver: ApolloDriver,
      resolvers: { UUID: CustomUuidScalar },
      introspection: true,
    }),
    TransactionModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
