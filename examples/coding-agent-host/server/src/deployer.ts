import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';
import type {
  BuildArtifacts,
  CloudAuthResponse,
  CloudMiniApp,
  CloudUploadResponse,
  DeployResult,
  MiniappSpec,
} from './types';

/**
 * Deploy a built miniapp to Nebula Cloud:
 * 1. Create MiniApp (POST /mini-apps)
 * 2. Upload version (POST /mini-apps/by-app-id/{appId}/versions/upload)
 * 3. Publish version (POST /mini-apps/{id}/versions/{versionId}/publish)
 */

export class Deployer {
  private cloudBaseUrl: string;

  constructor(cloudBaseUrl: string) {
    this.cloudBaseUrl = cloudBaseUrl.replace(/\/$/, '');
  }

  /**
   * Proxy: login to Nebula Cloud
   */
  async login(email: string, password: string): Promise<CloudAuthResponse> {
    return this.cloudRequest<CloudAuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  /**
   * Proxy: register on Nebula Cloud
   */
  async register(
    email: string,
    displayName: string,
    password: string,
  ): Promise<CloudAuthResponse> {
    return this.cloudRequest<CloudAuthResponse>('/auth/register', {
      method: 'POST',
      body: { email, displayName, password },
    });
  }

  /**
   * List all miniapps from Cloud
   */
  async listMiniApps(token: string): Promise<CloudMiniApp[]> {
    return this.cloudRequest<CloudMiniApp[]>('/mini-apps', { token });
  }

  /**
   * Full deploy: create miniapp → upload version → publish
   */
  async deploy(
    token: string,
    spec: MiniappSpec,
    artifacts: BuildArtifacts,
  ): Promise<DeployResult> {
    // Step 1: Create MiniApp on Cloud
    console.log(`[deployer] Creating MiniApp "${spec.appId}" on Cloud...`);
    const miniApp = await this.createMiniApp(token, spec);

    // Step 2: Upload version with build artifacts
    console.log(`[deployer] Uploading version for ${spec.appId}...`);
    const uploadResult = await this.uploadVersion(token, spec.appId, artifacts);

    // Step 3: Publish the version
    console.log(
      `[deployer] Publishing version ${uploadResult.version} (${uploadResult.id})...`,
    );
    await this.publishVersion(token, miniApp.id, uploadResult.id);

    return {
      miniAppId: spec.appId,
      versionId: uploadResult.id,
      version: uploadResult.version,
    };
  }

  /**
   * Create MiniApp on Nebula Cloud (POST /mini-apps)
   */
  private async createMiniApp(
    token: string,
    spec: MiniappSpec,
  ): Promise<CloudMiniApp> {
    try {
      const miniApps = await this.listMiniApps(token);
      const existing = miniApps.find(app => app.appId === spec.appId);
      if (existing) {
        console.log(`[deployer] MiniApp "${spec.appId}" already exists`);
        return existing;
      }
    } catch {
      // Ignore list errors, proceed to create
    }

    return this.cloudRequest<CloudMiniApp>('/mini-apps', {
      method: 'POST',
      token,
      body: {
        appId: spec.appId,
        name: spec.name,
        description: spec.description,
      },
    });
  }

  /**
   * Upload version to Nebula Cloud (multipart form-data)
   * POST /mini-apps/by-app-id/{appId}/versions/upload
   */
  private async uploadVersion(
    token: string,
    appId: string,
    artifacts: BuildArtifacts,
  ): Promise<CloudUploadResponse> {
    const form = new FormData();
    form.append('version', `1.0.${Date.now()}`);
    form.append('changelog', 'Deployed by Coding Agent');
    form.append('channel', 'stable');
    form.append('releaseType', 'RELEASE');

    // Attach bundle files
    form.append(
      'bundleIos',
      fs.createReadStream(artifacts.iosBundlePath),
      path.basename(artifacts.iosBundlePath),
    );
    form.append(
      'bundleAndroid',
      fs.createReadStream(artifacts.androidBundlePath),
      path.basename(artifacts.androidBundlePath),
    );
    form.append(
      'manifest',
      fs.createReadStream(artifacts.manifestPath),
      path.basename(artifacts.manifestPath),
    );
    form.append(
      'assetsIos',
      fs.createReadStream(artifacts.iosAssetsZipPath),
      'assets-ios.zip',
    );
    form.append(
      'assetsAndroid',
      fs.createReadStream(artifacts.androidAssetsZipPath),
      'assets-android.zip',
    );

    const url = `${this.cloudBaseUrl}/mini-apps/by-app-id/${appId}/versions/upload`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed (${response.status}): ${text}`);
    }

    return response.json() as Promise<CloudUploadResponse>;
  }

  /**
   * Publish a version on Nebula Cloud
   * POST /mini-apps/{miniAppId}/versions/{versionId}/publish
   */
  private async publishVersion(
    token: string,
    miniAppId: string,
    versionId: string,
  ): Promise<void> {
    await this.cloudRequest(
      `/mini-apps/${miniAppId}/versions/${versionId}/publish`,
      {
        method: 'POST',
        token,
        body: { notes: 'Deployed by Coding Agent' },
      },
    );
  }

  /**
   * Generic HTTP request to Nebula Cloud API
   */
  private async cloudRequest<T>(
    apiPath: string,
    options: { method?: string; token?: string; body?: unknown } = {},
  ): Promise<T> {
    const url = `${this.cloudBaseUrl}${apiPath}`;
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloud API error (${response.status}): ${text}`);
    }

    return response.json() as Promise<T>;
  }
}
