/**
 * Lightweight MCP (Model Context Protocol) client for React Native.
 * Communicates with the MCP server via Streamable HTTP (POST /mcp).
 */

import type { ToolDefinition } from '../types';

interface McpClientConfig {
  baseURL: string;
}

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
  id?: number | string;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
  id?: number | string | null;
}

interface McpTool {
  name: string;
  description?: string;
  inputSchema: Record<string, unknown>;
}

interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

interface McpResourceContent {
  uri: string;
  text?: string;
  blob?: string;
  mimeType?: string;
}

interface McpCallToolResult {
  content: Array<{ type: string; text?: string }>;
  isError?: boolean;
}

let requestIdCounter = 0;
function nextRequestId(): number {
  return ++requestIdCounter;
}

export class McpClient {
  private baseURL: string;
  private initialized = false;

  constructor(config: McpClientConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, '');
  }

  /**
   * Initialize the MCP session (must be called before any other method).
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Step 1: Send initialize request
    await this.send('initialize', {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: {
        name: 'nebula-coding-agent-rn',
        version: '1.0.0',
      },
    });

    // Step 2: Send initialized notification (no id)
    await this.sendNotification('notifications/initialized');

    this.initialized = true;
    console.log('[MCP] Client initialized');
  }

  /**
   * List all available tools from the MCP server.
   */
  async listTools(): Promise<McpTool[]> {
    const result = await this.send<{ tools: McpTool[] }>('tools/list', {});
    return result.tools;
  }

  /**
   * Call a tool on the MCP server.
   */
  async callTool(
    name: string,
    args: Record<string, unknown>,
  ): Promise<McpCallToolResult> {
    const result = await this.send<McpCallToolResult>('tools/call', {
      name,
      arguments: args,
    });
    return result;
  }

  /**
   * List all available resources from the MCP server.
   */
  async listResources(): Promise<McpResource[]> {
    const result = await this.send<{ resources: McpResource[] }>(
      'resources/list',
      {},
    );
    return result.resources;
  }

  /**
   * Read a resource from the MCP server.
   */
  async readResource(uri: string): Promise<McpResourceContent[]> {
    const result = await this.send<{ contents: McpResourceContent[] }>(
      'resources/read',
      { uri },
    );
    return result.contents;
  }

  /**
   * Convert MCP tools to OpenAI function-calling format for the LLM.
   */
  static toOpenAITools(tools: McpTool[]): ToolDefinition[] {
    return tools.map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description || '',
        parameters: tool.inputSchema,
      },
    }));
  }

  /**
   * Extract text from MCP callTool result.
   */
  static extractText(result: McpCallToolResult): string {
    return result.content
      .filter(c => c.type === 'text')
      .map(c => c.text || '')
      .join('\n');
  }

  // --- Internal ---

  private async send<T = unknown>(
    method: string,
    params: unknown,
  ): Promise<T> {
    const id = nextRequestId();
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    };

    const url = `${this.baseURL}/mcp`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `MCP request failed (${response.status}): ${text}`,
      );
    }

    const contentType = response.headers.get('content-type') || '';

    // Handle SSE response
    if (contentType.includes('text/event-stream')) {
      return this.parseSSEResponse<T>(response);
    }

    // Handle JSON response
    const json: JsonRpcResponse = await response.json();

    if (json.error) {
      throw new Error(
        `MCP error (${json.error.code}): ${json.error.message}`,
      );
    }

    return json.result as T;
  }

  private async sendNotification(method: string): Promise<void> {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
    };

    const url = `${this.baseURL}/mcp`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify(request),
    });
  }

  /**
   * Parse SSE stream and extract the final JSON-RPC result.
   * Format: "event: message\ndata: {json}\n\n"
   */
  private async parseSSEResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    const lines = text.split('\n');

    let lastResult: T | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        const data = trimmed.slice(6);
        if (!data || data === '[DONE]') continue;

        try {
          const json: JsonRpcResponse = JSON.parse(data);
          if (json.error) {
            throw new Error(
              `MCP error (${json.error.code}): ${json.error.message}`,
            );
          }
          if (json.result !== undefined) {
            lastResult = json.result as T;
          }
        } catch (e) {
          if (e instanceof Error && e.message.startsWith('MCP error')) {
            throw e;
          }
        }
      }
    }

    if (lastResult === null) {
      throw new Error('MCP SSE response contained no result');
    }

    return lastResult;
  }
}
