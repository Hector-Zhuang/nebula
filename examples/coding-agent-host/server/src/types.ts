// --- Types shared between server modules ---

export interface MiniappSpec {
  appId: string;
  name: string;
  description: string;
  pages: PageSpec[];
  features: string[];
  apis?: string[];
}

export interface PageSpec {
  name: string;
  description: string;
  components: string[];
}

export interface CodeFile {
  path: string;
  language: string;
  content: string;
}

// --- Project state ---

export type ProjectStatus =
  | 'created'
  | 'building'
  | 'built'
  | 'build_failed'
  | 'deploying'
  | 'deployed'
  | 'deploy_failed';

export interface Project {
  id: string;
  spec: MiniappSpec;
  codeFiles: CodeFile[];
  cloudToken: string;
  status: ProjectStatus;
  buildError?: string;
  deployError?: string;
  artifacts?: BuildArtifacts;
  deployResult?: DeployResult;
  createdAt: number;
  updatedAt: number;
}

export interface BuildArtifacts {
  iosBundlePath: string;
  androidBundlePath: string;
  manifestPath: string;
  iosAssetsZipPath: string;
  androidAssetsZipPath: string;
  projectDir: string;
}

export interface DeployResult {
  miniAppId: string;
  versionId: string;
  version: string;
}

// --- Nebula Cloud API response types ---

export interface CloudAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

export interface CloudMiniApp {
  id: string;
  appId: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CloudUploadResponse {
  buildNumber: number;
  id: string;
  status: string;
  version: string;
}

// --- Create project request body ---

export interface CreateProjectBody {
  spec: MiniappSpec;
  codeFiles: CodeFile[];
}

// --- Server configuration ---

export interface ServerConfig {
  port: number;
  projectsDir: string;
  cloudBaseUrl: string;
}
