import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomUuidScalar } from './transaction/interface/graphql/scalars/customUuid.scalar';
import { TransactionModule } from './transaction/interface/transaction.module';
import { CacheModule } from './cache/cache.module';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/interface/health.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      graphiql: true,
      driver: ApolloDriver,
      resolvers: { UUID: CustomUuidScalar },
      introspection: true,
    }),
    HealthModule,
    TransactionModule,
    CacheModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
