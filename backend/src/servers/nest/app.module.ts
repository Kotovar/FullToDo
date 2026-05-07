import { Module } from '@nestjs/common';
import { nestProviders } from './common/providers';

@Module({
  providers: nestProviders,
  exports: nestProviders,
})
export class AppModule {}
