export type User = {
  id: string;
  email: string;
  displayName: string;
  status?: 'ACTIVE' | 'DISABLED';
  notes?: string | null;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type MiniAppMember = {
  id: string;
  user: User;
};

export type MiniAppVersion = {
  id: string;
  version: string;
  buildNumber: number;
  bundles?: {
    ios: string;
    android: string;
  };
  bundleSizes?: {
    ios: number;
    android: number;
  };
  pages: string[];
  entryPagePath?: string | null;
  changelog?: string;
  status: string;
  createdAt: string;
  publishedAt?: string | null;
  createdBy: User;
  distributions: Array<{
    id: string;
    channel: string;
    notes?: string;
    createdAt: string;
  }>;
  accessCode?: {
    channel: 'draft';
    openUrl: string;
    installUrl: string;
    qrCodeDataUrl: string;
  };
};

export type MiniAppSettings = {
  id?: string;
  requestDomains: string[];
  socketDomains: string[];
  uploadDomains: string[];
  downloadDomains: string[];
  businessDomains: string[];
  sensitiveScopes: string[];
  privacyContactName?: string;
  privacyContactEmail?: string;
  remarks?: string;
};

export type MiniApp = {
  id: string;
  appId: string;
  name: string;
  description?: string;
  iconUrl?: string | null;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  members: MiniAppMember[];
  versions?: MiniAppVersion[];
  settings?: MiniAppSettings | null;
  currentReleaseVersion?: MiniAppVersion | null;
  accessCodes?: {
    release?: {
      channel: 'release';
      openUrl: string;
    } | null;
  };
};

export type AuditLog = {
  id: string;
  targetType: string;
  targetId: string;
  action: string;
  summary?: string;
  createdAt: string;
  actor: Pick<User, 'id' | 'displayName' | 'email'>;
};
