import type { CodeFile, MiniappSpec } from '../types';

interface AgentServerConfig {
  baseURL: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

interface ProjectResponse {
  projectId: string;
  status: string;
}

interface BuildResponse {
  buildId: string;
  status: 'building' | 'built' | 'failed';
  error?: string;
}

interface BuildStatusResponse {
  status: 'created' | 'building' | 'built' | 'failed' | 'build_failed';
  error?: string;
  artifacts?: {
    iosBundlePath: string;
    androidBundlePath: string;
    manifestPath: string;
  };
}

interface DeployResponse {
  success: boolean;
  miniAppId: string;
  versionId: string;
  version: string;
  status: string;
}

interface MiniAppResponse {
  id: string;
  appId: string;
  name: string;
  description?: string;
  createdAt: string;
}

async function request<T>(
  baseURL: string,
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {},
): Promise<T> {
  const url = `${baseURL.replace(/\/$/, '')}${path}`;
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
    throw new Error(text || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function createAgentServerClient(config: AgentServerConfig) {
  const base = config.baseURL;

  return {
    // Auth - proxy to Nebula Cloud
    async login(input: { email: string; password: string }) {
      return request<AuthResponse>(base, '/api/auth/login', {
        method: 'POST',
        body: input,
      });
    },

    async register(input: {
      email: string;
      displayName: string;
      password: string;
    }) {
      return request<AuthResponse>(base, '/api/auth/register', {
        method: 'POST',
        body: input,
      });
    },

    // Projects
    async createProject(
      token: string,
      input: { spec: MiniappSpec; codeFiles: CodeFile[] },
    ) {
      return request<ProjectResponse>(base, '/api/projects', {
        method: 'POST',
        token,
        body: input,
      });
    },

    async buildProject(token: string, projectId: string) {
      return request<BuildResponse>(base, `/api/projects/${projectId}/build`, {
        method: 'POST',
        token,
      });
    },

    async getBuildStatus(token: string, projectId: string) {
      return request<BuildStatusResponse>(
        base,
        `/api/projects/${projectId}/status`,
        { token },
      );
    },

    async deployProject(token: string, projectId: string) {
      return request<DeployResponse>(
        base,
        `/api/projects/${projectId}/deploy`,
        {
          method: 'POST',
          token,
        },
      );
    },

    // MiniApps
    async listMiniApps(token: string) {
      return request<MiniAppResponse[]>(base, '/api/miniapps', { token });
    },

    /**
     * Poll build status until completion or failure.
     */
    async waitForBuild(
      token: string,
      projectId: string,
      options?: { intervalMs?: number; timeoutMs?: number },
    ): Promise<BuildStatusResponse> {
      const interval = options?.intervalMs ?? 3000;
      const timeout = options?.timeoutMs ?? 300000; // 5 min default

      // Trigger the build first
      await this.buildProject(token, projectId);

      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const status = await this.getBuildStatus(token, projectId);
        if (
          status.status === 'built' ||
          status.status === 'failed' ||
          status.status === 'build_failed'
        ) {
          return status;
        }
        await new Promise<void>(resolve => setTimeout(resolve, interval));
      }

      throw new Error('Build timed out after 5 minutes');
    },
  };
}
