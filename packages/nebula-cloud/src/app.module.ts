import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MiniAppsModule } from './mini-apps/mini-apps.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), 'packages/nebula-cloud/.env'),
        path.resolve(process.cwd(), '.env'),
        path.resolve(__dirname, '../.env'),
      ],
    }),
    PrismaModule,
    AuthModule,
    MiniAppsModule,
    AdminModule,
    UploadsModule,
  ],
})
export class AppModule {}
