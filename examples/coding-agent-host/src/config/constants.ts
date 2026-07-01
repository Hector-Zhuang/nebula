import type { LLMConfig, ServerConfig } from '../types';

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',
  model: 'qwen2.5-coder:7b',
  temperature: 0.7,
};

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  baseURL: 'http://localhost:3100',
};

export const SETTINGS_STORAGE_KEY = '@coding-agent/settings';

export const APP_NAME = 'Nebula Coding Agent';

// Nebula miniapp appId validation (from CreateMiniAppDto)
export const APP_ID_REGEX = /^[a-z0-9-]+$/;
export const APP_NAME_MIN_LENGTH = 2;
