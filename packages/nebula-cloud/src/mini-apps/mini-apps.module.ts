import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MiniAppsController } from './mini-apps.controller';
import { MiniAppsService } from './mini-apps.service';
import { VersionAccessController } from './version-access.controller';

@Module({
  imports: [AuthModule],
  controllers: [MiniAppsController, VersionAccessController],
  providers: [MiniAppsService],
  exports: [MiniAppsService],
})
export class MiniAppsModule {}
