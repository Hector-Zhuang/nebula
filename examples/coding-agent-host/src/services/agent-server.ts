/**
 * Agent Server client — auth only (project tools moved to MCP).
 */

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

async function request<T>(
  baseURL: string,
  apiPath: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const url = `${baseURL.replace(/\/$/, '')}${apiPath}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
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
  };
}
