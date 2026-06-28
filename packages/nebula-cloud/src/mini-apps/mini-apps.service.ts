import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VersionStatus } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMiniAppDto } from './dto/create-mini-app.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { PublishVersionDto } from './dto/publish-version.dto';
import { RollbackVersionDto } from './dto/rollback-version.dto';
import { UpdateMiniAppDto } from './dto/update-mini-app.dto';

type CurrentUser = {
  id: string;
};

type VersionManifestSummary = {
  pages: string[];
  entryPagePath: string | null;
};

type BundlePlatform = 'ios' | 'android';
type VersionAssetType = 'bundle' | 'manifest' | 'assets';

type VersionBundles = {
  ios: string;
  android: string;
};

@Injectable()
export class MiniAppsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async listMiniApps() {
    const miniapps = await this.prisma.miniApp.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return miniapps.map(app => ({
      ...app,
      iconUrl: this.resolvePublicUrl(app.iconUrl),
      thumbnailUrl: this.resolvePublicUrl(app.thumbnailUrl),
    }));
  }

  async createMiniApp(user: CurrentUser, input: CreateMiniAppDto) {
    const existing = await this.prisma.miniApp.findUnique({
      where: { appId: input.appId },
    });
    if (existing) {
      throw new BadRequestException('appId already exists');
    }
    const miniApp = await this.prisma.miniApp.create({
      data: {
        appId: input.appId,
        name: input.name,
        description: input.description,
        iconUrl: input.iconUrl,
        thumbnailUrl: this.generateThumbnailDataUrl(
          input.iconUrl,
          input.name,
          input.appId,
        ),
        createdById: user.id,
        members: {
          create: [
            {
              userId: user.id,
            },
          ],
        },
        settings: {
          create: {},
        },
      },
    });
    await this.logAudit(
      user.id,
      'mini-app',
      miniApp.id,
      'create',
      `Created mini app ${miniApp.appId}`,
      { appId: miniApp.appId, name: miniApp.name },
    );
    return this.getMiniApp(user, miniApp.id);
  }

  async updateMiniApp(
    user: CurrentUser,
    miniAppId: string,
    input: UpdateMiniAppDto,
  ) {
    await this.assertMember(user, miniAppId);
    const current = await this.prisma.miniApp.findUnique({
      where: { id: miniAppId },
    });
    if (!current) {
      throw new NotFoundException('Mini-app not found');
    }

    const nextName = input.name ?? current.name;
    const nextIconUrl =
      input.iconUrl !== undefined ? input.iconUrl || null : current.iconUrl;

    await this.prisma.miniApp.update({
      where: { id: miniAppId },
      data: {
        name: input.name,
        description: input.description,
        iconUrl: nextIconUrl,
        thumbnailUrl: this.generateThumbnailDataUrl(
          nextIconUrl ?? undefined,
          nextName,
          current.appId,
        ),
      },
    });

    await this.logAudit(
      user.id,
      'mini-app',
      miniAppId,
      'update',
      `Updated mini app ${current.appId}`,
      { fields: Object.keys(input) },
    );

    return this.getMiniApp(user, miniAppId);
  }

  async getMiniApp(user: CurrentUser, miniAppId: string) {
    await this.assertMember(user, miniAppId);
    const miniApp = await this.findMiniAppOrThrow(miniAppId);
    return this.serializeMiniApp(miniApp);
  }

  async getMiniAppWorkspace(user: CurrentUser, miniAppId: string) {
    const miniApp = await this.getMiniApp(user, miniAppId);

    // Build static release access code (no token)
    const releaseAccess = miniApp.currentReleaseVersion
      ? {
          channel: 'release',
          openUrl: `nebula://miniapp/install/${miniApp.appId}`,
        }
      : null;

    // Build per-draft access codes (with token)
    const versionsWithAccess = await Promise.all(
      (miniApp.versions ?? []).map(async version => {
        if (version.status === VersionStatus.DRAFT) {
          const accessCode = await this.buildDraftAccessCode(
            miniAppId,
            version.id,
            miniApp.appId,
          );
          return { ...version, accessCode };
        }
        return version;
      }),
    );

    return {
      ...miniApp,
      versions: versionsWithAccess,
      accessCodes: {
        release: releaseAccess,
      },
    };
  }

  async uploadVersion(
    user: CurrentUser,
    appId: string,
    input: CreateVersionDto,
    files: {
      bundleIosFile: Express.Multer.File;
      bundleAndroidFile: Express.Multer.File;
      manifestFile: Express.Multer.File;
      assetsIosFile: Express.Multer.File;
      assetsAndroidFile: Express.Multer.File;
    },
  ) {
    const miniApp = await this.prisma.miniApp.findUnique({
      where: { appId },
    });
    if (!miniApp) {
      throw new NotFoundException(`Mini-app ${appId} not found`);
    }
    await this.assertMember(user, miniApp.id);

    const manifest = JSON.parse(
      fs.readFileSync(files.manifestFile.path, 'utf8'),
    );
    if (manifest.appId && manifest.appId !== appId) {
      throw new BadRequestException(
        'Uploaded manifest appId does not match route appId',
      );
    }

    const existingVersion = await this.prisma.miniAppVersion.findFirst({
      where: {
        miniAppId: miniApp.id,
        version: input.version,
      },
    });

    if (existingVersion && existingVersion.status === VersionStatus.PUBLISHED) {
      throw new BadRequestException(
        `Version ${input.version} has already been published as a release and cannot be replaced`,
      );
    }

    const data = {
      createdById: user.id,
      buildNumber: 1,
      changelog: input.changelog,
      channel: 'stable',
      bundleIosPath: files.bundleIosFile.path,
      bundleAndroidPath: files.bundleAndroidFile.path,
      manifestPath: files.manifestFile.path,
      bundleIosSize: files.bundleIosFile.size,
      bundleAndroidSize: files.bundleAndroidFile.size,
      assetsIosPath: files.assetsIosFile.path,
      assetsAndroidPath: files.assetsAndroidFile.path,
      assetsIosSize: files.assetsIosFile.size,
      assetsAndroidSize: files.assetsAndroidFile.size,
      status: VersionStatus.DRAFT,
      publishedAt: null,
    };

    const version = await this.prisma.$transaction(async tx => {
      const nextVersion = existingVersion
        ? await tx.miniAppVersion.update({
            where: { id: existingVersion.id },
            data,
            include: this.versionInclude(),
          })
        : await tx.miniAppVersion.create({
            data: {
              miniAppId: miniApp.id,
              version: input.version,
              ...data,
            },
            include: this.versionInclude(),
          });

      await tx.distributionRecord.create({
        data: {
          versionId: nextVersion.id,
          releasedById: user.id,
          channel: 'upload',
          notes: existingVersion ? 'Replaced uploaded build' : 'Uploaded build',
        },
      });

      return nextVersion;
    });

    await this.logAudit(
      user.id,
      'mini-app-version',
      version.id,
      existingVersion ? 'replace-upload' : 'upload',
      `Uploaded build ${version.version}`,
      {
        miniAppId: miniApp.id,
        appId,
      },
    );

    return this.serializeVersion(version);
  }

  async publishVersion(
    user: CurrentUser,
    miniAppId: string,
    versionId: string,
    input: PublishVersionDto,
  ) {
    await this.assertMember(user, miniAppId);

    const version = await this.requireVersion(miniAppId, versionId);
    if (version.status === VersionStatus.PUBLISHED) {
      throw new BadRequestException('Version is already published');
    }
    if (version.status !== VersionStatus.DRAFT) {
      throw new BadRequestException('Only a draft version can be published');
    }

    const published = await this.prisma.$transaction(async tx => {
      const nextVersion = await tx.miniAppVersion.update({
        where: { id: versionId },
        data: {
          status: VersionStatus.PUBLISHED,
          channel: 'stable',
          publishedAt: new Date(),
        },
        include: this.versionInclude(),
      });
      await tx.miniApp.update({
        where: { id: miniAppId },
        data: {
          currentReleaseVersionId: versionId,
        },
      });
      await tx.distributionRecord.create({
        data: {
          versionId,
          releasedById: user.id,
          channel: 'stable',
          notes: input.notes,
        },
      });
      return nextVersion;
    });
    await this.logAudit(
      user.id,
      'mini-app-version',
      versionId,
      'publish-release',
      `Published version ${published.version} to release`,
      { miniAppId, channel: 'stable' },
    );
    return this.serializeVersion(published);
  }

  async rollbackReleaseVersion(
    user: CurrentUser,
    miniAppId: string,
    input: RollbackVersionDto,
  ) {
    await this.assertMember(user, miniAppId);
    const target = await this.requireVersion(miniAppId, input.targetVersionId);
    if (target.status !== VersionStatus.PUBLISHED) {
      throw new BadRequestException(
        'Only previously published versions can be rolled back online',
      );
    }

    const version = await this.prisma.$transaction(async tx => {
      await tx.miniApp.update({
        where: { id: miniAppId },
        data: {
          currentReleaseVersionId: target.id,
        },
      });
      await tx.distributionRecord.create({
        data: {
          versionId: target.id,
          releasedById: user.id,
          channel: 'rollback',
          notes: input.notes,
        },
      });
      return tx.miniAppVersion.findUniqueOrThrow({
        where: { id: target.id },
        include: this.versionInclude(),
      });
    });

    await this.logAudit(
      user.id,
      'mini-app-version',
      target.id,
      'rollback-release',
      `Rolled back release traffic to version ${version.version}`,
      { miniAppId, notes: input.notes ?? null },
    );

    return this.serializeVersion(version);
  }

  async deleteVersion(user: CurrentUser, miniAppId: string, versionId: string) {
    await this.assertMember(user, miniAppId);

    const version = await this.prisma.miniAppVersion.findFirst({
      where: {
        id: versionId,
        miniAppId,
      },
      select: {
        id: true,
        version: true,
        status: true,
        bundleIosPath: true,
        bundleAndroidPath: true,
        manifestPath: true,
        assetsIosPath: true,
        assetsAndroidPath: true,
      },
    });
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    if (version.status === VersionStatus.PUBLISHED) {
      throw new BadRequestException('Published versions cannot be deleted');
    }

    await this.prisma.miniAppVersion.delete({
      where: { id: version.id },
    });

    this.removeFileIfExists(version.bundleIosPath);
    this.removeFileIfExists(version.bundleAndroidPath);
    this.removeFileIfExists(version.manifestPath);
    this.removeFileIfExists(version.assetsIosPath);
    this.removeFileIfExists(version.assetsAndroidPath);
    await this.logAudit(
      user.id,
      'mini-app-version',
      version.id,
      'delete',
      `Deleted version ${version.version}`,
      { miniAppId },
    );

    return {
      success: true,
      versionId: version.id,
    };
  }

  async getVersionInstallPayload(versionId: string, token: string) {
    await this.verifyAccessToken(versionId, token);
    const version = await this.prisma.miniAppVersion.findUnique({
      where: { id: versionId },
      include: {
        miniApp: true,
      },
    });
    if (!version) {
      throw new NotFoundException('Version not found');
    }

    const bundles = this.buildInstallBundleUrls(version.id, token);
    const assetsUrl = this.buildInstallAssetsUrls(version.id, token);
    return {
      appId: version.miniApp.appId,
      appName: version.miniApp.name,
      iconUrl: this.resolvePublicUrl(version.miniApp.iconUrl),
      versionId: version.id,
      version: version.version,
      routeUrl: `nebula://${version.miniApp.appId}`,
      bundles,
      assetsUrl,
      manifestUrl: this.resolvePublicUrl(
        `/api/mini-apps/access/versions/${version.id}/manifest?token=${encodeURIComponent(token)}`,
      )!,
    };
  }

  async getReleaseInstallPayloadByAppId(appId: string) {
    const miniApp = await this.prisma.miniApp.findUnique({
      where: { appId },
      include: {
        currentReleaseVersion: true,
      },
    });
    if (!miniApp) {
      throw new NotFoundException('Mini-app not found');
    }
    if (!miniApp.currentReleaseVersion) {
      throw new NotFoundException(
        'No release version available for this mini-app',
      );
    }

    const version = miniApp.currentReleaseVersion;
    const bundles = this.buildInstallBundleUrls(version.id, '');
    const assetsUrl = this.buildInstallAssetsUrls(version.id, '');
    return {
      appId: miniApp.appId,
      appName: miniApp.name,
      iconUrl: this.resolvePublicUrl(miniApp.iconUrl),
      versionId: version.id,
      version: version.version,
      routeUrl: `nebula://${miniApp.appId}`,
      bundles,
      assetsUrl,
      manifestUrl: this.resolvePublicUrl(
        `/api/mini-apps/access/versions/${version.id}/manifest`,
      )!,
    };
  }

  async getVersionAsset(
    versionId: string,
    token: string,
    type: VersionAssetType,
    platform: BundlePlatform = 'ios',
  ) {
    if (token) {
      await this.verifyAccessToken(versionId, token);
    }
    const version = await this.prisma.miniAppVersion.findUnique({
      where: { id: versionId },
      select: {
        bundleIosPath: true,
        bundleAndroidPath: true,
        manifestPath: true,
        assetsIosPath: true,
        assetsAndroidPath: true,
      },
    });
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    let filePath: string;
    let contentType: string;
    if (type === 'bundle') {
      filePath = this.getBundlePathForPlatform(version, platform);
      contentType = 'application/javascript';
    } else if (type === 'manifest') {
      filePath = version.manifestPath;
      contentType = 'application/json';
    } else {
      filePath =
        platform === 'android'
          ? version.assetsAndroidPath
          : version.assetsIosPath;
      contentType = 'application/zip';
    }
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`${type} file not found`);
    }
    return {
      filePath,
      fileName: path.basename(filePath),
      contentType,
    };
  }

  getUploadDestination(appId: string) {
    const baseDir = process.env.UPLOAD_DIR || './storage';
    const appDir = path.join(baseDir, 'miniapps', appId);
    fs.mkdirSync(appDir, { recursive: true });
    return appDir;
  }

  private async findMiniAppOrThrow(miniAppId: string) {
    const miniApp = await this.prisma.miniApp.findUnique({
      where: { id: miniAppId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
                status: true,
              },
            },
          },
        },
        currentReleaseVersion: {
          include: this.versionInclude(),
        },
        versions: {
          orderBy: [{ createdAt: 'desc' }],
          include: this.versionInclude(),
        },
      },
    });
    if (!miniApp) {
      throw new NotFoundException('Mini-app not found');
    }
    return miniApp;
  }

  private async requireVersion(miniAppId: string, versionId: string) {
    const version = await this.prisma.miniAppVersion.findFirst({
      where: {
        id: versionId,
        miniAppId,
      },
      include: this.versionInclude(),
    });
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    return version;
  }

  private serializeMiniApp(
    miniApp: Awaited<ReturnType<typeof this.findMiniAppOrThrow>>,
  ) {
    return {
      ...miniApp,
      versions: miniApp.versions.map(version => this.serializeVersion(version)),
      iconUrl: this.resolvePublicUrl(miniApp.iconUrl),
      thumbnailUrl: this.resolvePublicUrl(miniApp.thumbnailUrl),
      currentReleaseVersion: miniApp.currentReleaseVersion
        ? this.serializeVersion(miniApp.currentReleaseVersion)
        : null,
    };
  }

  private serializeVersion(version: any) {
    const manifestSummary = this.readManifestSummary(version.manifestPath);
    return {
      ...version,
      bundles: {
        ios: version.bundleIosPath,
        android: version.bundleAndroidPath,
      },
      bundleSizes: {
        ios: version.bundleIosSize,
        android: version.bundleAndroidSize,
      },
      assetsSizes: {
        ios: version.assetsIosSize,
        android: version.assetsAndroidSize,
      },
      pages: manifestSummary.pages,
      entryPagePath: manifestSummary.entryPagePath,
    };
  }

  private versionInclude() {
    return {
      createdBy: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
      distributions: true,
    } as const;
  }

  private async assertMember(user: CurrentUser, miniAppId: string) {
    const member = await this.prisma.miniAppMember.findFirst({
      where: {
        miniAppId,
        userId: user.id,
      },
    });
    if (!member) {
      throw new ForbiddenException('You do not have access to this mini-app');
    }
  }

  private async verifyAccessToken(versionId: string, token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        purpose: string;
        versionId: string;
      }>(token);
      if (
        payload.purpose !== 'version-access' ||
        payload.versionId !== versionId
      ) {
        throw new ForbiddenException('Invalid version access token');
      }
    } catch {
      throw new ForbiddenException('Invalid or expired version access token');
    }
  }

  private getApiBaseUrl() {
    return (
      process.env.PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
    ).replace(/\/$/, '');
  }

  private resolvePublicUrl(relativePath: string | null | undefined) {
    if (!relativePath) return null;
    if (
      relativePath.startsWith('http://') ||
      relativePath.startsWith('https://') ||
      relativePath.startsWith('data:')
    ) {
      return relativePath;
    }
    const apiBaseUrl = this.getApiBaseUrl();
    const clean = apiBaseUrl.endsWith('/api')
      ? relativePath.replace(/^\/api\//, '/')
      : relativePath;
    return `${apiBaseUrl}${clean}`;
  }

  private getReviewInstallScheme() {
    return (process.env.PUBLIC_REVIEW_INSTALL_SCHEME || 'nebula').replace(
      /:\/?\/?$/,
      '',
    );
  }

  private buildInstallBundleUrls(
    versionId: string,
    token: string,
  ): VersionBundles {
    const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
    return {
      ios: this.resolvePublicUrl(
        `/api/mini-apps/access/versions/${versionId}/bundles/ios${tokenParam}`,
      )!,
      android: this.resolvePublicUrl(
        `/api/mini-apps/access/versions/${versionId}/bundles/android${tokenParam}`,
      )!,
    };
  }

  private buildInstallAssetsUrls(
    versionId: string,
    token: string,
  ): VersionBundles {
    const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
    return {
      ios: this.resolvePublicUrl(
        `/api/mini-apps/access/versions/${versionId}/assets/ios${tokenParam}`,
      )!,
      android: this.resolvePublicUrl(
        `/api/mini-apps/access/versions/${versionId}/assets/android${tokenParam}`,
      )!,
    };
  }

  private getBundlePathForPlatform(
    version: {
      bundleIosPath: string;
      bundleAndroidPath: string;
    },
    platform: BundlePlatform,
  ): string {
    return platform === 'android'
      ? version.bundleAndroidPath
      : version.bundleIosPath;
  }

  private async buildDraftAccessCode(
    miniAppId: string,
    versionId: string,
    _appId: string,
  ) {
    const token = await this.jwtService.signAsync({
      purpose: 'version-access',
      versionId,
      miniAppId,
      channel: 'draft',
    });

    const installUrl = this.resolvePublicUrl(
      `/api/mini-apps/access/versions/${versionId}/install?token=${encodeURIComponent(token)}`,
    )!;
    const installScheme = this.getReviewInstallScheme();
    const openUrl = `${installScheme}://miniapp/install/${versionId}?token=${encodeURIComponent(token)}&installUrl=${encodeURIComponent(installUrl)}`;
    const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(openUrl)}`;

    return {
      channel: 'draft' as const,
      openUrl,
      installUrl,
      qrCodeDataUrl,
    };
  }

  private readManifestSummary(manifestPath: string): VersionManifestSummary {
    try {
      const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
        entryPagePath?: string;
        pages?: string[] | Record<string, string>;
      };

      const pageKeys = Array.isArray(raw.pages)
        ? raw.pages
        : Object.keys(raw.pages || {});

      return {
        pages: pageKeys.map(page => (page.startsWith('/') ? page : `/${page}`)),
        entryPagePath: raw.entryPagePath || null,
      };
    } catch {
      return {
        pages: [],
        entryPagePath: null,
      };
    }
  }

  private generateThumbnailDataUrl(
    iconUrl: string | undefined,
    name: string,
    appId: string,
  ) {
    if (iconUrl?.trim()) {
      return iconUrl.trim();
    }

    const seed = `${name}-${appId}`.trim();
    const initials =
      seed
        .split(/[\s-_]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || '')
        .join('') || 'MA';
    const hue =
      seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${hue} 72% 58%)"/>
            <stop offset="100%" stop-color="hsl(${(hue + 38) % 360} 70% 44%)"/>
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#g)"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="white">${initials}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  private removeFileIfExists(filePath: string) {
    if (!filePath) {
      return;
    }
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Ignore cleanup failures after DB delete.
    }
  }

  private async logAudit(
    actorId: string,
    targetType: string,
    targetId: string,
    action: string,
    summary: string,
    metadataJson?: Record<string, unknown>,
  ) {
    await this.prisma.auditLog.create({
      data: {
        actorId,
        targetType,
        targetId,
        action,
        summary,
        metadataJson: metadataJson as any,
      },
    });
  }
}
