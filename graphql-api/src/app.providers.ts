import { CacheModule } from './cache/cache.module';
import { ConfigModule } from './config/config.module';
import { TransactionModule } from './transaction/interface/transaction.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomUuidScalar } from './transaction/interface/graphql/scalars/customUuid.scalar';

export const appProviders = [
  GraphQLModule.forRoot<ApolloDriverConfig>({
    autoSchemaFile: true,
    graphiql: true,
    driver: ApolloDriver,
    resolvers: { UUID: CustomUuidScalar },
    introspection: true,
  }),
  TransactionModule,
  CacheModule,
  ConfigModule,
];
