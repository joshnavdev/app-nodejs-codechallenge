import { Module } from '@nestjs/common';
import { appProviders } from './app.providers';

@Module({
  imports: appProviders,
  controllers: [],
  providers: [],
})
export class AppModule {}
