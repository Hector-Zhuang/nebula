import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MiniAppsService } from './mini-apps.service';
import { CreateMiniAppDto } from './dto/create-mini-app.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { PublishVersionDto } from './dto/publish-version.dto';
import { RollbackVersionDto } from './dto/rollback-version.dto';
import { UpdateMiniAppDto } from './dto/update-mini-app.dto';

@UseGuards(JwtAuthGuard)
@Controller('mini-apps')
export class MiniAppsController {
  constructor(private readonly miniAppsService: MiniAppsService) {}

  @Get()
  list() {
    return this.miniAppsService.listMiniApps();
  }

  @Post()
  create(@Req() req: { user: any }, @Body() input: CreateMiniAppDto) {
    return this.miniAppsService.createMiniApp(req.user, input);
  }

  @Get(':miniAppId')
  detail(@Req() req: { user: any }, @Param('miniAppId') miniAppId: string) {
    return this.miniAppsService.getMiniApp(req.user, miniAppId);
  }

  @Patch(':miniAppId')
  update(
    @Req() req: { user: any },
    @Param('miniAppId') miniAppId: string,
    @Body() input: UpdateMiniAppDto,
  ) {
    return this.miniAppsService.updateMiniApp(req.user, miniAppId, input);
  }

  @Get(':miniAppId/workspace')
  workspace(@Req() req: { user: any }, @Param('miniAppId') miniAppId: string) {
    return this.miniAppsService.getMiniAppWorkspace(req.user, miniAppId);
  }

  @Post('by-app-id/:appId/versions/upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bundleIos', maxCount: 1 },
        { name: 'bundleAndroid', maxCount: 1 },
        { name: 'manifest', maxCount: 1 },
        { name: 'assetsIos', maxCount: 1 },
        { name: 'assetsAndroid', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (_req, file, cb) => {
            const appId = _req.params.appId;
            const baseDir = process.env.UPLOAD_DIR || './storage';
            const targetDir = path.join(baseDir, 'miniapps', appId as string);
            fs.mkdirSync(targetDir, { recursive: true });
            cb(null, targetDir);
          },
          filename: (_req, file, cb) => {
            const suffix = `${Date.now()}-${file.originalname}`;
            cb(null, suffix);
          },
        }),
      },
    ),
  )
  uploadVersion(
    @Req() req: { user: any },
    @Param('appId') appId: string,
    @Body() input: CreateVersionDto,
    @UploadedFiles()
    files: {
      bundleIos?: Express.Multer.File[];
      bundleAndroid?: Express.Multer.File[];
      manifest?: Express.Multer.File[];
      assetsIos?: Express.Multer.File[];
      assetsAndroid?: Express.Multer.File[];
    },
  ) {
    const bundleIosFile = files.bundleIos?.[0];
    const bundleAndroidFile = files.bundleAndroid?.[0];
    const manifestFile = files.manifest?.[0];
    const assetsIosFile = files.assetsIos?.[0];
    const assetsAndroidFile = files.assetsAndroid?.[0];

    if (!bundleIosFile || !bundleAndroidFile || !manifestFile) {
      throw new BadRequestException(
        'bundleIos, bundleAndroid, and manifest files are required',
      );
    }

    if (!assetsIosFile || !assetsAndroidFile) {
      throw new BadRequestException(
        'assetsIos and assetsAndroid files are required',
      );
    }

    return this.miniAppsService.uploadVersion(req.user, appId, input, {
      bundleIosFile,
      bundleAndroidFile,
      manifestFile,
      assetsIosFile,
      assetsAndroidFile,
    });
  }

  @Post(':miniAppId/versions/:versionId/publish')
  publish(
    @Req() req: { user: any },
    @Param('miniAppId') miniAppId: string,
    @Param('versionId') versionId: string,
    @Body() input: PublishVersionDto,
  ) {
    return this.miniAppsService.publishVersion(
      req.user,
      miniAppId,
      versionId,
      input,
    );
  }

  @Post(':miniAppId/rollback')
  rollback(
    @Req() req: { user: any },
    @Param('miniAppId') miniAppId: string,
    @Body() input: RollbackVersionDto,
  ) {
    return this.miniAppsService.rollbackReleaseVersion(
      req.user,
      miniAppId,
      input,
    );
  }

  @Delete(':miniAppId/versions/:versionId')
  removeVersion(
    @Req() req: { user: any },
    @Param('miniAppId') miniAppId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.miniAppsService.deleteVersion(req.user, miniAppId, versionId);
  }
}
