// --- Conversation phase state machine (simplified from 6 → 2) ---
export type ConversationPhase = 'idle' | 'streaming';

// --- Chat message types ---
export type MessageRole = 'user' | 'assistant';

export type MessageType = 'text' | 'tool' | 'action' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  toolCallName?: string;
  toolCallStatus?: 'running' | 'success' | 'error';
  appId?: string;
}

// --- Tool Calling types (OpenAI function calling format) ---

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<
        string,
        {
          type: string;
          description: string;
          enum?: string[];
          items?: Record<string, unknown>;
        }
      >;
      required: string[];
    };
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface ToolCallDelta {
  index: number;
  id?: string;
  type?: 'function';
  function?: {
    name?: string;
    arguments?: string;
  };
}

export interface ToolResult {
  tool_call_id: string;
  role: 'tool';
  content: string; // JSON string
  name?: string;
}

// --- LLM conversation message (supports system/user/assistant/tool roles) ---
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

// --- Miniapp Spec (used internally by tools & agent-server) ---
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

// --- Code file (used internally by tools & agent-server) ---
export interface CodeFile {
  path: string;
  language: string;
  content: string;
}

// --- LLM configuration ---
export interface LLMConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  temperature: number;
}

// --- Server configuration ---
export interface ServerConfig {
  baseURL: string;
}

// --- Cloud configuration ---
export interface CloudConfig {
  email: string;
  password: string;
  accessToken?: string;
  displayName?: string;
}

// --- Application settings ---
export interface AppSettings {
  llm: LLMConfig;
  server: ServerConfig;
  cloud: CloudConfig;
}

// --- Stream result from LLM ---
export type StreamResult =
  | { type: 'text'; content: string }
  | { type: 'tool_calls'; content: string; toolCalls: ToolCall[] };
