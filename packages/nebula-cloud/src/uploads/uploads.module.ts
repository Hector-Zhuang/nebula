import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [AuthModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
