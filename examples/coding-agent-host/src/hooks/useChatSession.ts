import { useCallback, useReducer, useRef } from 'react';
import type {
  AppSettings,
  ChatMessage,
  LLMMessage,
  StreamResult,
  ToolDefinition,
} from '../types';
import { streamChatCompletion } from '../services/llm';
import { SYSTEM_PROMPT } from '../services/prompts';
import { executeMcpTool, getToolLabel, fetchToolDefinitions } from '../services/tools';
import { McpClient } from '../services/mcp-client';
import { chatReducer, initialState } from '../state/chat-reducer';

let messageIdCounter = 0;
function nextId(): string {
  messageIdCounter += 1;
  return `msg-${Date.now()}-${messageIdCounter}`;
}

function createMessage(
  role: 'user' | 'assistant',
  type: ChatMessage['type'],
  content: string,
  extras?: {
    isStreaming?: boolean;
    toolCallName?: string;
    toolCallStatus?: 'running' | 'success' | 'error';
    appId?: string;
  },
): ChatMessage {
  return {
    id: nextId(),
    role,
    type,
    content,
    timestamp: Date.now(),
    ...extras,
  };
}

function summarizeToolResult(content: string): string {
  try {
    const data = JSON.parse(content);
    if (data.error) return `Error: ${data.error}`;
    if (data.projectId) return `Project ${data.projectId}`;
    if (data.status) return `Status: ${data.status}`;
    if (data.version) return `Version ${data.version} published`;
    if (data.miniAppId) return `App ${data.miniAppId}`;
    if (Array.isArray(data)) return `${data.length} item(s)`;
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  } catch {
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  }
}

export function useChatSession(settings: AppSettings) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Full LLM conversation history (including tool_calls and tool results)
  const historyRef = useRef<LLMMessage[]>([
    { role: 'system', content: SYSTEM_PROMPT },
  ]);

  // Track whether tool calling is supported (fallback if provider doesn't support it)
  const toolSupportRef = useRef<boolean>(true);

  // MCP client and cached tool definitions
  const mcpClientRef = useRef<McpClient | null>(null);
  const toolDefsRef = useRef<ToolDefinition[] | null>(null);

  /**
   * Ensure MCP client is initialized and tool definitions are loaded.
   */
  const ensureMcpReady = useCallback(async (): Promise<ToolDefinition[] | null> => {
    if (toolDefsRef.current) return toolDefsRef.current;

    if (!mcpClientRef.current) {
      mcpClientRef.current = new McpClient({
        baseURL: settings.server.baseURL,
      });
    }

    const defs = await fetchToolDefinitions(mcpClientRef.current);
    toolDefsRef.current = defs;
    return defs;
  }, [settings.server.baseURL]);

  // --- Agent loop ---
  const sendMessage = useCallback(
    async (text: string) => {
      // Ensure MCP is connected
      let toolDefs: ToolDefinition[] | null = null;
      try {
        toolDefs = await ensureMcpReady();
      } catch (err) {
        console.error('[chat] MCP init failed:', err);
      }

      // Add user message to UI + history
      dispatch({
        type: 'ADD_MESSAGE',
        message: createMessage('user', 'text', text),
      });
      historyRef.current.push({ role: 'user', content: text });
      dispatch({ type: 'SET_PHASE', phase: 'streaming' });
      dispatch({ type: 'SET_STATUS', statusText: 'Thinking...' });

      const MAX_ITERATIONS = 10;

      try {
        for (let i = 0; i < MAX_ITERATIONS; i++) {
          // Create a new streaming assistant message
          dispatch({ type: 'SET_STATUS', statusText: 'Thinking...' });
          const assistantMsg = createMessage('assistant', 'text', '', {
            isStreaming: true,
          });
          dispatch({ type: 'ADD_MESSAGE', message: assistantMsg });

          // Stream from LLM
          const result: StreamResult = await new Promise((resolve, reject) => {
            const tools = toolSupportRef.current ? toolDefs : null;

            streamChatCompletion(settings.llm, historyRef.current, tools, {
              onTextDelta: (token: string) => {
                dispatch({
                  type: 'UPDATE_STREAMING_MESSAGE',
                  id: assistantMsg.id,
                  delta: token,
                });
                // Clear status text once content is streaming
                dispatch({ type: 'SET_STATUS', statusText: '' });
              },
              onToolCallDetected: (_name: string) => {
                // Will show tool status after stream completes
              },
              onComplete: resolve,
              onError: (error: string) => {
                // Check if this is a tool-calling-not-supported error
                if (
                  toolSupportRef.current &&
                  (error.includes('tool') ||
                    error.includes('function') ||
                    error.includes('400') ||
                    error.includes('422'))
                ) {
                  toolSupportRef.current = false;
                  // Retry without tools
                  const fallbackTools = null;
                  streamChatCompletion(
                    settings.llm,
                    historyRef.current,
                    fallbackTools,
                    {
                      onTextDelta: (token: string) => {
                        dispatch({
                          type: 'UPDATE_STREAMING_MESSAGE',
                          id: assistantMsg.id,
                          delta: token,
                        });
                        dispatch({ type: 'SET_STATUS', statusText: '' });
                      },
                      onToolCallDetected: () => {},
                      onComplete: resolve,
                      onError: reject,
                    },
                  );
                  return;
                }
                reject(new Error(error));
              },
            });
          });

          // Finalize this assistant message
          dispatch({
            type: 'FINALIZE_STREAMING_MESSAGE',
            id: assistantMsg.id,
          });

          if (result.type === 'text') {
            historyRef.current.push({
              role: 'assistant',
              content: result.content,
            });
            break;
          }

          if (result.type === 'tool_calls') {
            // Push assistant message (with tool_calls) to history
            historyRef.current.push({
              role: 'assistant',
              content: result.content || null,
              tool_calls: result.toolCalls,
            });

            // Execute each tool call via MCP
            for (const toolCall of result.toolCalls) {
              const label = getToolLabel(toolCall.function.name);
              const toolMsg = createMessage('assistant', 'tool', label, {
                toolCallName: toolCall.function.name,
                toolCallStatus: 'running',
              });
              dispatch({ type: 'ADD_MESSAGE', message: toolMsg });

              // Execute the tool via MCP
              dispatch({ type: 'SET_STATUS', statusText: `${label}...` });
              const toolResult = mcpClientRef.current
                ? await executeMcpTool(
                    mcpClientRef.current,
                    settings.cloud.accessToken || '',
                    toolCall,
                  )
                : {
                    tool_call_id: toolCall.id,
                    role: 'tool' as const,
                    name: toolCall.function.name,
                    content: JSON.stringify({ error: 'MCP client not connected' }),
                  };

              // Push tool result to history
              historyRef.current.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: toolResult.content,
                name: toolCall.function.name,
              });

              // Update tool status in UI
              const summary = summarizeToolResult(toolResult.content);
              let statusData: { error?: string } | null = null;
              try {
                statusData = JSON.parse(toolResult.content);
              } catch {
                // ignore
              }
              const status: 'success' | 'error' = statusData?.error
                ? 'error'
                : 'success';

              dispatch({
                type: 'UPDATE_TOOL_STATUS',
                id: toolMsg.id,
                status,
                content: `${label}: ${summary}`,
              });

              // After successful deployment, inject an action message with "Open MiniApp" button
              if (
                toolCall.function.name === 'deploy_project' &&
                status === 'success'
              ) {
                try {
                  const deployData = JSON.parse(toolResult.content);
                  if (deployData.miniAppId) {
                    dispatch({
                      type: 'ADD_MESSAGE',
                      message: createMessage(
                        'assistant',
                        'action',
                        `Miniapp "${deployData.miniAppId}" has been deployed successfully!`,
                        { appId: deployData.miniAppId },
                      ),
                    });
                  }
                } catch {
                  // ignore parse error
                }
              }
            }

            // Continue the loop — LLM will see tool results
          }
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        dispatch({ type: 'SET_ERROR', error: msg });
        dispatch({
          type: 'ADD_MESSAGE',
          message: createMessage('assistant', 'error', msg),
        });
      }

      dispatch({ type: 'SET_PHASE', phase: 'idle' });
      dispatch({ type: 'SET_STATUS', statusText: '' });
    },
    [settings.llm, settings.cloud.accessToken, ensureMcpReady],
  );

  const resetSession = useCallback(() => {
    historyRef.current = [{ role: 'system', content: SYSTEM_PROMPT }];
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    sendMessage,
    resetSession,
  };
}
