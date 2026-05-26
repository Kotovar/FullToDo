import { Module } from '@nestjs/common';
import { SharedModule } from '../common/shared.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
})
export class AuthModule {}
