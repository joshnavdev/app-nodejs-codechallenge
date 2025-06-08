import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CustomUuidScalar } from './transaction/interface/graphql/scalars/customUuid.scalar';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
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
