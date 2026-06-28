import type { ToolDefinition, ToolCall, ToolResult } from '../types';
import { McpClient } from './mcp-client';

// ---------- MCP-based tool executor ----------

/**
 * Execute a tool call via MCP client and return a ToolResult for the LLM.
 */
export async function executeMcpTool(
  mcpClient: McpClient,
  cloudToken: string,
  toolCall: ToolCall,
): Promise<ToolResult> {
  const { id, function: fn } = toolCall;
  const name = fn.name;

  try {
    const args = fn.arguments ? JSON.parse(fn.arguments) : {};

    // Inject cloudToken into args (required by all MCP tools)
    args.cloudToken = cloudToken;

    const result = await mcpClient.callTool(name, args);
    const text = McpClient.extractText(result);

    return {
      tool_call_id: id,
      role: 'tool',
      name,
      content: text,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      tool_call_id: id,
      role: 'tool',
      name,
      content: JSON.stringify({ error: message }),
    };
  }
}

// ---------- Helpers ----------

/** Human-readable label for a tool name */
export function getToolLabel(name: string): string {
  const labels: Record<string, string> = {
    create_project: 'Creating project',
    build_project: 'Building project',
    get_build_status: 'Checking build status',
    deploy_project: 'Deploying to Cloud',
    list_miniapps: 'Listing miniapps',
  };
  return labels[name] || name;
}

/**
 * Fetch tool definitions from MCP server and convert to OpenAI format.
 * Returns null if MCP connection fails.
 */
export async function fetchToolDefinitions(
  mcpClient: McpClient,
): Promise<ToolDefinition[] | null> {
  try {
    await mcpClient.initialize();
    const tools = await mcpClient.listTools();
    return McpClient.toOpenAITools(tools);
  } catch (err) {
    console.error('[tools] Failed to fetch tool definitions from MCP:', err);
    return null;
  }
}
