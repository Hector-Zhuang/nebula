import EventSource from 'react-native-sse';
import type {
  LLMConfig,
  LLMMessage,
  ToolDefinition,
  ToolCall,
  ToolCallDelta,
  StreamResult,
} from '../types';

// ---------- Stream callbacks ----------

export interface StreamCallbacks {
  onTextDelta: (token: string) => void;
  onToolCallDetected: (name: string) => void;
  onComplete: (result: StreamResult) => void;
  onError: (error: string) => void;
}

// ---------- Request types ----------

interface ChatCompletionRequest {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
  stream: boolean;
  tools?: ToolDefinition[];
  tool_choice?: string;
}

// ---------- SSE chunk types ----------

interface SSEChunk {
  id: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string | null;
      tool_calls?: ToolCallDelta[];
    };
    finish_reason: string | null;
  }>;
}

// ---------- Public API ----------

export function streamChatCompletion(
  config: LLMConfig,
  messages: LLMMessage[],
  tools: ToolDefinition[] | null,
  callbacks: StreamCallbacks,
): { close: () => void } {
  const url = `${config.baseURL.replace(/\/$/, '')}/chat/completions`;

  const body: ChatCompletionRequest = {
    model: config.model,
    messages,
    temperature: config.temperature ?? 0.7,
    max_tokens: 4096,
    stream: true,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }

  let textBuffer = '';
  let toolCallsBuffer: ToolCall[] = [];
  let finishReason: string | null = null;
  const detectedToolNames = new Set<string>();

  const es = new EventSource(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
    timeout: 120000,
  });

  es.addEventListener('open', () => {
    // Connection established
  });

  es.addEventListener('message', event => {
    if (!event.data) return;

    const data = event.data;

    // End of stream marker
    if (data.trim() === '[DONE]') {
      es.close();
      if (!finalized) {
        finalized = true;
        finalize();
      }
      return;
    }

    try {
      const chunk: SSEChunk = JSON.parse(data);
      const choice = chunk.choices?.[0];
      if (!choice) return;

      const { delta } = choice;

      // Accumulate text content
      if (delta.content) {
        textBuffer += delta.content;
        callbacks.onTextDelta(delta.content);
      }

      // Accumulate tool calls
      if (delta.tool_calls) {
        toolCallsBuffer = accumulateToolCalls(
          toolCallsBuffer,
          delta.tool_calls,
        );

        // Notify when a new tool name is detected
        for (const tc of toolCallsBuffer) {
          if (tc.function.name && !detectedToolNames.has(tc.function.name)) {
            detectedToolNames.add(tc.function.name);
            callbacks.onToolCallDetected(tc.function.name);
          }
        }
      }

      // Record finish reason
      if (choice.finish_reason) {
        finishReason = choice.finish_reason;
      }
    } catch {
      // Ignore JSON parse errors on partial chunks
    }
  });

  es.addEventListener('error', event => {
    es.close();
    if (event.type === 'error') {
      const errMsg =
        'message' in event
          ? (event as { message: string }).message
          : `SSE error (status: ${'xhrStatus' in event ? (event as { xhrStatus: number }).xhrStatus : 'unknown'})`;
      callbacks.onError(errMsg);
    } else if (event.type === 'timeout') {
      callbacks.onError('SSE connection timed out');
    } else if (event.type === 'exception') {
      callbacks.onError(
        (event as { message?: string }).message || 'SSE exception',
      );
    }
  });

  let finalized = false;

  es.addEventListener('close', () => {
    if (!finalized) {
      finalized = true;
      finalize();
    }
  });

  es.open();

  function finalize() {
    if (finishReason === 'tool_calls' && toolCallsBuffer.length > 0) {
      callbacks.onComplete({
        type: 'tool_calls',
        content: textBuffer,
        toolCalls: toolCallsBuffer,
      });
    } else {
      callbacks.onComplete({
        type: 'text',
        content: textBuffer,
      });
    }
  }

  return {
    close: () => {
      es.close();
    },
  };
}

// ---------- Tool call accumulation ----------

function accumulateToolCalls(
  existing: ToolCall[],
  deltas: ToolCallDelta[],
): ToolCall[] {
  const result = [...existing];

  for (const delta of deltas) {
    const idx = delta.index;

    if (!result[idx]) {
      // First chunk for this index
      result[idx] = {
        id: delta.id || '',
        type: 'function',
        function: {
          name: delta.function?.name || '',
          arguments: delta.function?.arguments || '',
        },
      };
    } else {
      // Subsequent chunks — append arguments, update id/name if present
      if (delta.id) {
        result[idx].id = delta.id;
      }
      if (delta.function?.name) {
        result[idx].function.name += delta.function.name;
      }
      if (delta.function?.arguments) {
        result[idx].function.arguments += delta.function.arguments;
      }
    }
  }

  return result;
}
