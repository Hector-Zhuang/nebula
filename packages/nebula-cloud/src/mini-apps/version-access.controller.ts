import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import path from 'path';
import { MiniAppsService } from './mini-apps.service';

@Controller('mini-apps/access')
export class VersionAccessController {
  constructor(private readonly miniAppsService: MiniAppsService) {}

  @Get('apps/:appId/release/install')
  releaseInstallPayload(@Param('appId') appId: string) {
    return this.miniAppsService.getReleaseInstallPayloadByAppId(appId);
  }

  @Get('versions/:versionId/install')
  installPayload(
    @Param('versionId') versionId: string,
    @Query('token') token: string,
  ) {
    return this.miniAppsService.getVersionInstallPayload(versionId, token);
  }

  @Get('versions/:versionId/bundle')
  async bundle(
    @Param('versionId') versionId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const asset = await this.miniAppsService.getVersionAsset(
      versionId,
      token,
      'bundle',
    );
    res.setHeader('Content-Type', asset.contentType);
    res.sendFile(path.resolve(asset.filePath), {
      headers: { 'Content-Type': asset.contentType },
    });
  }

  @Get('versions/:versionId/bundles/:platform')
  async bundleByPlatform(
    @Param('versionId') versionId: string,
    @Param('platform') platform: 'ios' | 'android',
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const asset = await this.miniAppsService.getVersionAsset(
      versionId,
      token,
      'bundle',
      platform,
    );
    res.setHeader('Content-Type', asset.contentType);
    res.sendFile(path.resolve(asset.filePath), {
      headers: { 'Content-Type': asset.contentType },
    });
  }

  @Get('versions/:versionId/manifest')
  async manifest(
    @Param('versionId') versionId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const asset = await this.miniAppsService.getVersionAsset(
      versionId,
      token,
      'manifest',
    );

    res.setHeader('Content-Type', asset.contentType);
    res.sendFile(path.resolve(asset.filePath), {
      headers: { 'Content-Type': asset.contentType },
    });
  }

  @Get('versions/:versionId/assets/:platform')
  async assets(
    @Param('versionId') versionId: string,
    @Param('platform') platform: 'ios' | 'android',
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const asset = await this.miniAppsService.getVersionAsset(
      versionId,
      token,
      'assets',
      platform,
    );
    res.setHeader('Content-Type', asset.contentType);
    res.sendFile(path.resolve(asset.filePath), {
      headers: { 'Content-Type': asset.contentType },
    });
  }
}
