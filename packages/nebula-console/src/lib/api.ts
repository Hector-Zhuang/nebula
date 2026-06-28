import type { AuditLog, AuthResponse, MiniApp, User } from '../types';

const API_BASE_URL =
  (import.meta as ImportMeta & { env: { VITE_API_BASE_URL?: string } }).env
    .VITE_API_BASE_URL || 'http://localhost:3001/api';

type RequestOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  register(input: { email: string; displayName: string; password: string }) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: input,
    });
  },
  login(input: { email: string; password: string }) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: input,
    });
  },
  requestPasswordReset(email: string) {
    return request<{ success: true }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },
  resetPassword(token: string, password: string) {
    return request<{ success: true }>('/auth/reset-password', {
      method: 'POST',
      body: { token, password },
    });
  },
  createCliAuthSession() {
    return request<{
      code: string;
      verificationUrl: string;
      expiresAt: string;
      intervalSeconds: number;
    }>('/auth/cli/sessions', {
      method: 'POST',
    });
  },
  getCliAuthSession(code: string) {
    return request<{
      status: 'pending' | 'approved' | 'expired';
      accessToken?: string;
      user?: User;
    }>(`/auth/cli/sessions/${code}`);
  },
  approveCliAuthSession(token: string, code: string) {
    return request<{ success: true; user: User }>(
      `/auth/cli/sessions/${code}/approve`,
      {
        method: 'POST',
        token,
      },
    );
  },
  me(token: string) {
    return request<User>('/auth/me', { token });
  },
  updateMyProfile(token: string, input: { avatarUrl?: string }) {
    return request<User>('/auth/me', {
      method: 'PATCH',
      token,
      body: input,
    });
  },
  uploadImage(token: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_BASE_URL}/uploads/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async response => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Upload failed with ${response.status}`);
      }
      return response.json();
    });
  },
  listMiniApps(token: string) {
    return request<MiniApp[]>('/mini-apps', { token });
  },
  createMiniApp(
    token: string,
    input: {
      appId: string;
      name: string;
      description?: string;
      iconUrl?: string;
    },
  ) {
    return request<MiniApp>('/mini-apps', {
      method: 'POST',
      token,
      body: input,
    });
  },
  getMiniApp(token: string, miniAppId: string) {
    return request<MiniApp>(`/mini-apps/${miniAppId}`, { token });
  },
  getMiniAppWorkspace(token: string, miniAppId: string) {
    return request<MiniApp>(`/mini-apps/${miniAppId}/workspace`, { token });
  },
  updateMiniApp(
    token: string,
    miniAppId: string,
    input: { name?: string; description?: string; iconUrl?: string },
  ) {
    return request<MiniApp>(`/mini-apps/${miniAppId}`, {
      method: 'PATCH',
      token,
      body: input,
    });
  },
  publishVersion(
    token: string,
    miniAppId: string,
    versionId: string,
    notes?: string,
  ) {
    return request(`/mini-apps/${miniAppId}/versions/${versionId}/publish`, {
      method: 'POST',
      token,
      body: { notes },
    });
  },
  deleteVersion(token: string, miniAppId: string, versionId: string) {
    return request(`/mini-apps/${miniAppId}/versions/${versionId}`, {
      method: 'DELETE',
      token,
    });
  },
  rollbackVersion(
    token: string,
    miniAppId: string,
    targetVersionId: string,
    notes?: string,
  ) {
    return request(`/mini-apps/${miniAppId}/rollback`, {
      method: 'POST',
      token,
      body: { targetVersionId, notes },
    });
  },
  listAdminUsers(token: string) {
    return request<{ users: User[]; auditLogs: AuditLog[] }>('/admin/users', {
      token,
    });
  },
  createAdminUser(
    token: string,
    input: {
      email: string;
      displayName: string;
      password: string;
      status?: string;
      notes?: string;
    },
  ) {
    return request<User>('/admin/users', {
      method: 'POST',
      token,
      body: input,
    });
  },
  updateAdminUser(
    token: string,
    userId: string,
    input: {
      email?: string;
      displayName?: string;
      password?: string;
      status?: string;
      notes?: string;
      avatarUrl?: string;
    },
  ) {
    return request<User>(`/admin/users/${userId}`, {
      method: 'PATCH',
      token,
      body: input,
    });
  },
};
